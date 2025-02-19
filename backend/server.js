const fs = require("fs");
const dotenv = require("dotenv");
const express = require("express");
const { google } = require("googleapis");
const path = require("path"); // Import the path module
var axios = require("axios").default;
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const AWS = require("aws-sdk");

const jwksRsa = require("jwks-rsa");
const { expressjwt: jwtMiddleware } = require("express-jwt");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 10000;

// Middleware to verify JWT token using Auth0 public key
const checkJwt = jwtMiddleware({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Modified checkScope middleware to be used with specific scopes
const checkScope = (requiredScopes) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.scope) {
      return res.status(401).json({ message: "No authentication found" });
    }

    const scopes = req.auth.scope.split(" ");
    const hasScope = requiredScopes.every((scope) => scopes.includes(scope));

    if (!hasScope) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }
    next();
  };
};

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log("Decoded JWT Token:", decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

const getAuth0AccessToken = async () => {
  const options = {
    method: "POST",
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }),
  };

  try {
    const response = await axios.request(options);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Auth0 access token:", error);
    throw error;
  }
};

const getUserInfo = async (email) => {
  const accessToken = await getAuth0AccessToken();

  const options = {
    method: "GET",
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    params: {
      email: email,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data[0]; // Assuming the email is unique and returns a single user
  } catch (error) {
    console.error("Error getting user info from Auth0:", error);
    throw error;
  }
};

var options = {
  method: "POST",
  url: "https://dev-h6b2f6mjco5pu6wz.us.auth0.com/oauth/token",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  data: new URLSearchParams({
    grant_type: "client_credentials",
    client_id: "AUTH0_CLIENT_ID",
    client_secret: "AUTH0_CLIENT_SECRET",
    audience: "AUTH0_AUDIENCE",
  }),
};

axios
  .request(options)
  .then(function (response) {})
  .catch(function (error) {});

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const bucketName = process.env.AWS_BUCKET_NAME;

// PostgreSQL Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/protected", (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload files
app.post("/api/uploads", upload.array("files"), async (req, res) => {
  const {
    folderId,
    folderName,
    author,
    uploadDate,
    country,
    category,
    isPublic,
    workpackage,
    isMeeting,
    isDeliverable,
    isContactList,
    isPromotion,
    isReport,
    isPublication,
    isTemplate,
  } = req.body;

  const files = req.files;

  try {
    for (const file of files) {
      const encodedFolderName = encodeURIComponent(folderName);
      const encodedFileName = encodeURIComponent(file.originalname);
      const fileKey = folderId
        ? `${encodedFolderName}/${Date.now()}_${encodedFileName}`
        : `${Date.now()}_${encodedFileName}`;

      const params = {
        Bucket: bucketName, // Ensure bucketName is correctly referenced
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // Upload file to S3
      const uploadResult = await s3.upload(params).promise();
      const fileUrl = uploadResult.Location;

      // Prepare the INSERT statement and values
      const query = folderId
        ? "INSERT INTO uploads (folder_id, folder_name, author, upload_date, country, category, file, file_url, file_key, is_public, workpackage, is_meeting, is_deliverable, is_contact_list, is_promotion, is_report, is_publication, is_template) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *"
        : "INSERT INTO uploads (author, upload_date, country, category, file, file_url, file_key, is_public, workpackage, is_meeting, is_deliverable, is_contact_list, is_promotion, is_report, is_publication, is_template) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *";
      const values = folderId
        ? [
            folderId,
            folderName,
            author,
            uploadDate,
            country,
            category,
            file.originalname, // Add the file name to the file column
            fileUrl,
            fileKey,
            isPublic === "true", // Ensure boolean values are correctly handled
            workpackage || null, // Handle empty workpackage
            isMeeting === "true", // Ensure boolean values are correctly handled
            isDeliverable === "true", // Ensure boolean values are correctly handled
            isContactList === "true", // Ensure boolean values are correctly handled
            isPromotion === "true", // Ensure boolean values are correctly handled
            isReport === "true", // Ensure boolean values are correctly handled
            isPublication === "true", // Ensure boolean values are correctly handled
            isTemplate === "true", // Ensure boolean values are correctly handled
          ]
        : [
            author,
            uploadDate,
            country,
            category,
            file.originalname, // Add the file name to the file column
            fileUrl,
            fileKey,
            isPublic === "true", // Ensure boolean values are correctly handled
            workpackage || null, // Handle empty workpackage
            isMeeting === "true", // Ensure boolean values are correctly handled
            isDeliverable === "true", // Ensure boolean values are correctly handled
            isContactList === "true", // Ensure boolean values are correctly handled
            isPromotion === "true", // Ensure boolean values are correctly handled
            isReport === "true", // Ensure boolean values are correctly handled
            isPublication === "true", // Ensure boolean values are correctly handled
            isTemplate === "true", // Ensure boolean values are correctly handled
          ];

      // Log the query and values for debugging
      console.log("Executing query:", query);
      console.log("With values:", values);

      // Execute the INSERT statement
      const result = await pool.query(query, values);

      console.log("File metadata saved to database:", result.rows[0]);
    }

    res.status(200).json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Endpoint to get list of uploaded files
app.get(
  "/api/uploads",
  checkJwt,
  checkScope(["read:files"]),
  async (req, res) => {
    try {
      const query =
        "SELECT * FROM uploads WHERE folder_id IS NULL ORDER BY upload_date DESC";
      const result = await pool.query(query);
      res.json({ files: result.rows });
    } catch (error) {
      console.error("Error fetching uploads:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Endpoint to fetch folders and their files
app.get(
  "/api/folders",
  checkJwt,
  checkScope(["read:folders"]),
  async (req, res) => {
    try {
      const foldersQuery = `
        SELECT f.*,
          COALESCE(json_agg(
            CASE WHEN u.id IS NOT NULL THEN
              json_build_object(
                'id', u.id,
                'file_key', u.file_key,
                'file_url', u.file_url,
                'author', u.author,
                'upload_date', u.upload_date,
                'category', u.category,
                'country', u.country
              )
            END
          ) FILTER (WHERE u.id IS NOT NULL), '[]') AS files
        FROM folders f
        LEFT JOIN uploads u ON f.id = u.folder_id
        GROUP BY f.id, f.folder_name, f.author, f.upload_date, f.country, 
                 f.category, f.is_public, f.workpackage, f.is_meeting, 
                 f.is_deliverable, f.is_contact_list, f.is_promotion, 
                 f.is_report, f.is_publication, f.is_template
        ORDER BY f.upload_date DESC;
      `;
      const foldersResult = await pool.query(foldersQuery);
      res.json({ folders: foldersResult.rows });
    } catch (error) {
      console.error("Error fetching folders:", error);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// Endpoint to serve uploaded files
app.get(
  "/api/uploads/:fileKey",
  checkJwt,
  checkScope(["read:files", "read:folders"]), // Fixed scope array
  async (req, res) => {
    const { fileKey } = req.params;
    const decodedKey = decodeURIComponent(fileKey);

    console.log("Attempting to fetch file:", decodedKey); // Debug log

    try {
      // Check if file exists in database first
      const fileQuery = "SELECT file_key FROM uploads WHERE file_key = $1";
      const fileResult = await pool.query(fileQuery, [decodedKey]);

      if (fileResult.rows.length === 0) {
        console.log("File not found in database:", decodedKey);
        return res.status(404).json({ message: "File not found in database" });
      }

      const params = {
        Bucket: bucketName,
        Key: decodedKey,
      };

      const file = await s3.getObject(params).promise();

      res.setHeader("Content-Type", file.ContentType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${decodedKey.split("/").pop()}"`
      );
      res.send(file.Body);
    } catch (error) {
      console.error("Error fetching file:", error);
      if (error.code === "NoSuchKey") {
        res.status(404).json({ message: "File not found in S3" });
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: error.message,
          key: decodedKey, // Include the key in error response
        });
      }
    }
  }
);

// Endpoint to serve ppt and pptx files
app.get("/api/download-ppt/:fileKey", async (req, res) => {
  const { fileKey } = req.params;
  console.log("Fetching ppt/pptx file with key:", fileKey);

  const params = {
    Bucket: bucketName, // Ensure bucketName is correctly referenced
    Key: fileKey,
  };

  try {
    const file = await s3.getObject(params).promise();
    console.log("File fetched successfully:", file);
    res.setHeader("Content-Type", file.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
    res.send(file.Body);
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Endpoint to delete a folder or file
app.delete("/api/uploads/:id", checkJwt, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the item is a folder
    const folderQuery = "SELECT * FROM folders WHERE id = $1";
    const folderValues = [id];
    const folderResult = await pool.query(folderQuery, folderValues);

    if (folderResult.rowCount > 0) {
      // Delete all files in the folder
      const deleteFilesQuery =
        "DELETE FROM uploads WHERE folder_id = $1 RETURNING *";
      const deleteFilesValues = [id];
      const deleteFilesResult = await pool.query(
        deleteFilesQuery,
        deleteFilesValues
      );

      // Delete the folder
      const deleteFolderQuery = "DELETE FROM folders WHERE id = $1 RETURNING *";
      const deleteFolderValues = [id];
      const deleteFolderResult = await pool.query(
        deleteFolderQuery,
        deleteFolderValues
      );

      console.log(
        "Folder and its files deleted from database:",
        deleteFolderResult.rows[0],
        deleteFilesResult.rows
      );

      return res.status(200).json({
        message: "Folder and its files deleted successfully",
        folder: deleteFolderResult.rows[0],
        files: deleteFilesResult.rows,
      });
    }

    // Check if the item is a file
    const fileQuery = "SELECT * FROM uploads WHERE id = $1";
    const fileValues = [id];
    const fileResult = await pool.query(fileQuery, fileValues);

    if (fileResult.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete the file
    const deleteFileQuery = "DELETE FROM uploads WHERE id = $1 RETURNING *";
    const deleteFileValues = [id];
    const deleteFileResult = await pool.query(
      deleteFileQuery,
      deleteFileValues
    );

    console.log("File deleted from database:", deleteFileResult.rows[0]);

    res.status(200).json({
      message: "File deleted successfully",
      item: deleteFileResult.rows[0],
    });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      console.error("Unauthorized error:", error);
      return res
        .status(401)
        .json({ message: "Invalid token or token expired" });
    }
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to post news articles
app.post("/api/news", upload.single("image"), async (req, res) => {
  const { title, content, author } = req.body; // Extract author from request body
  const image = req.file;

  if (!title || !content || !author) {
    // Check if author is provided
    return res
      .status(400)
      .json({ message: "Title, content, and author are required" });
  }

  let imageUrl = null;
  if (image) {
    const fileKey = `${Date.now()}_${image.originalname}`;
    const params = {
      Bucket: bucketName, // Ensure bucketName is correctly referenced
      Key: fileKey,
      Body: image.buffer,
      ContentType: image.mimetype,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      imageUrl = uploadResult.Location;
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  try {
    const query =
      "INSERT INTO news (title, content, author, image_url) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [title, content, author, imageUrl];
    const result = await pool.query(query, values);

    console.log("News article saved to database:", result.rows[0]);

    res.status(201).json({
      message: "News article posted successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error posting news article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get a specific news article by ID
app.get("/api/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM news WHERE id = $1";
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "News article not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching news article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to update news articles
app.put("/api/news/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    // Fetch the existing post data
    const existingPostQuery = "SELECT * FROM news WHERE id = $1";
    const existingPostResult = await pool.query(existingPostQuery, [id]);

    if (existingPostResult.rowCount === 0) {
      return res.status(404).json({ message: "News article not found" });
    }

    const existingPost = existingPostResult.rows[0];
    const uploadDate = existingPost.upload_date; // Preserve the original upload date

    let imageUrl = existingPost.image_url; // Use existing image URL if no new image is provided
    if (image) {
      const fileKey = `${Date.now()}_${image.originalname}`;
      const params = {
        Bucket: bucketName, // Ensure bucketName is correctly referenced
        Key: fileKey,
        Body: image.buffer,
        ContentType: image.mimetype,
      };

      try {
        const uploadResult = await s3.upload(params).promise();
        imageUrl = uploadResult.Location;
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    const query =
      "UPDATE news SET title = $1, content = $2, image_url = $3, upload_date = $4 WHERE id = $5 RETURNING *";
    const values = [title, content, imageUrl, uploadDate, id];
    const result = await pool.query(query, values);

    console.log("News article updated in database:", result.rows[0]);

    res.status(200).json({
      message: "News article updated successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating news article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to delete news articles
app.delete("/api/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM news WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "News article not found" });
    }

    console.log("News article deleted from database:", result.rows[0]);

    res.status(200).json({
      message: "News article deleted successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting news article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/update-author", checkJwt, async (req, res) => {
  const { oldAuthor, newAuthor } = req.body;

  try {
    // Update uploads table
    const uploadsQuery = "UPDATE uploads SET author = $1 WHERE author = $2";
    await pool.query(uploadsQuery, [newAuthor, oldAuthor]);

    // Update folders table
    const foldersQuery = "UPDATE folders SET author = $1 WHERE author = $2";
    await pool.query(foldersQuery, [newAuthor, oldAuthor]);

    res.json({ message: "Author names updated successfully" });
  } catch (error) {
    console.error("Error updating author names:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get list of news articles
app.get("/api/news", async (req, res) => {
  try {
    const query = "SELECT * FROM news ORDER BY created_at DESC LIMIT 3";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Måste Server running on port ${port}`);
});
