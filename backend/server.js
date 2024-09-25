const fs = require("fs");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path"); // Import the path module
var axios = require("axios").default;
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
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

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log("Decoded JWT Token:", decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
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

// Endpoint to get Auth0 access token
app.get("/api/auth/token", async (req, res) => {
  var options = {
    method: "POST",
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
    }),
  };

  try {
    const response = await axios.request(options);
    const token = response.data.access_token;
    decodeToken(token); // Decode the token
    res.json(response.data);
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
app.post("/api/uploads", upload.single("file"), async (req, res) => {
  const {
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
  const file = req.file;

  console.log("Received data:", {
    author,
    uploadDate,
    country,
    category,
    file,
    isPublic,
    workpackage,
    isMeeting,
    isDeliverable,
    isContactList,
    isPromotion,
    isReport,
    isPublication,
    isTemplate,
  });

  if (!file || !author || !uploadDate || !country || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const fileKey = `${Date.now()}_${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Make the file publicly accessible
  };

  try {
    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();
    const fileUrl = uploadResult.Location;

    // Insert file metadata into PostgreSQL
    const query =
      "INSERT INTO uploads (author, upload_date, country, category, file_url, file_key, is_public, workpackage, is_meeting, is_deliverable, is_contact_list, is_promotion, is_report, is_publication, is_template) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *";
    const values = [
      author,
      uploadDate,
      country,
      category,
      fileUrl,
      fileKey,
      isPublic,
      workpackage,
      isMeeting,
      isDeliverable,
      isContactList,
      isPromotion,
      isReport,
      isPublication,
      isTemplate,
    ];
    const result = await pool.query(query, values);

    console.log("File metadata saved to database:", result.rows[0]);

    res.status(201).json({
      message: "File uploaded successfully",
      upload: result.rows[0],
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get list of uploaded files
app.get("/api/uploads", async (req, res) => {
  try {
    const query = "SELECT * FROM uploads ORDER BY upload_date DESC";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to serve uploaded files
app.get("/api/uploads/:fileKey", async (req, res) => {
  const { fileKey } = req.params;
  console.log("Fetching file with key:", fileKey);

  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const file = await s3.getObject(params).promise();
    console.log("File fetched successfully:", file);
    res.setHeader("Content-Type", file.ContentType);
    res.send(file.Body);
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Endpoint to post news articles
app.post("/api/news", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  let imageUrl = null;
  if (image) {
    const fileKey = `${Date.now()}_${image.originalname}`;
    const params = {
      Bucket: bucketName,
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
      "INSERT INTO news (title, content, image_url) VALUES ($1, $2, $3) RETURNING *";
    const values = [title, content, imageUrl];
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

  let imageUrl = null;
  if (image) {
    const fileKey = `${Date.now()}_${image.originalname}`;
    const params = {
      Bucket: bucketName,
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
      "UPDATE news SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *";
    const values = [title, content, imageUrl, id];
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
  console.log(`Server running on port ${port}`);
});
