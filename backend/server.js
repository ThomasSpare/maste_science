const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const analytics = google.analyticsreporting("v4");

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;
//Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

// Load the private and public keys
const privateKey = fs.readFileSync(path.join(__dirname, "private.key"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "public.key"), "utf8");

// Route to generate a token for testing
app.post("/generate-token", (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, privateKey, {
    expiresIn: "1h",
    algorithm: "RS256",
  });
  res.json({ token });
});

// Mock function to get user by ID
async function getUserById(userId) {
  // Replace this with actual database call
  return { id: userId, email: "ts@ts.com" };
}

// Authentication middleware
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
      req.user = await getUserById(payload.userId);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  next();
});

app.get("/authorized", function (req, res) {
  if (req.user) {
    res.send(`Secured Resource for user: ${req.user.email}`);
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/test", (req, res) => {
  res.send("Server is running!");
});

const allowedOrigins = [
  process.env.ALLOWED_ORIGINS,
  "https://maste-science-frontend.onrender.com",
  "https://maste-science.onrender.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const upload = multer({ dest: "uploads/" });
const ppt = multer({ dest: "ppt/" });
const pptx = multer({ dest: "pptx/" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

// Authorization

async function getAuth0AccessToken() {
  try {
    const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: "client_credentials",
      scope: "create:users",
    });

    console.log("Access Token Response:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting Auth0 access token:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function createUserInAuth0(email, password) {
  const accessToken = await getAuth0AccessToken();

  console.log("Using Access Token:", accessToken);

  try {
    const response = await axios.post(
      `https://${auth0Domain}/api/v2/users`,
      {
        email: email,
        password: password,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }
    );

    console.log("User Creation Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user in Auth0:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Route to get Auth0 access token
app.get("/api/auth0-token", async (req, res) => {
  try {
    const token = await getAuth0AccessToken();
    res.json({ accessToken: token });
  } catch (error) {
    console.error("Error getting Auth0 access token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// REGISTER NEW USER

// Route to register a new user
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Registering user with email:", email);

    const user = await createUserInAuth0(email, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(
      "Error creating user in Auth0:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

// Uploading files
app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { author, uploadDate, country, category } = req.body;
  pool.query(
    "INSERT INTO uploads (file, author, uploadDate, country, category) VALUES ($1, $2, $3, $4, $5)",
    [req.file.filename, author, uploadDate, country, category],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "File uploaded successfully" });
      }
    }
  );
});

app.post("/ppt", ppt.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { author, uploadDate, country, category } = req.body;
  pool.query(
    "INSERT INTO ppt (file, author, uploadDate, country, category) VALUES ($1, $2, $3, $4, $5)",
    [req.file.filename, author, uploadDate, country, category],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "File uploaded successfully" });
      }
    }
  );
});

app.post("/pptx", pptx.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { author, uploadDate, country, category } = req.body;
  pool.query(
    "INSERT INTO pptx (file, author, uploadDate, country, category) VALUES ($1, $2, $3, $4, $5)",
    [req.file.filename, author, uploadDate, country, category],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.status(201).json({ message: "File uploaded successfully" });
      }
    }
  );
});

// Searching Files in the Database
app.get("/api/uploads", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM uploads");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/ppt", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM ppt");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/pptx", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM pptx");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/uploads/:file", async (req, res) => {
  const { file } = req.params;
  try {
    const queryResult = await pool.query(
      "SELECT file FROM uploads WHERE file = $1",
      [file]
    );
    if (queryResult.rows.length > 0) {
      const { file } = queryResult.rows[0];
      const ext = path.extname(file).toLowerCase();
      let folder = "uploads/";

      if (ext === ".pdf") {
        folder += "pdf";
      } else if (ext === ".ppt") {
        folder += "ppt";
      } else if (ext === ".pptx") {
        folder += "pptx";
      }

      const filePath = path.join(__dirname, folder, file);

      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `inline; filename="${file}"`);
      res.sendFile(filePath);
    } else {
      res(404).json({ message: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Assuming you have set up OAuth2 authentication
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ANALYTICS_CLIENT_ID,
  process.env.GOOGLE_ANALYTICS_CLIENT_SECRET,
  process.env.GOOGLE_ANALYTICS_REDIRECT_URI
);

app.listen(port, () => {
  console.log(`Måste Server listening at port:${port}`);
});
