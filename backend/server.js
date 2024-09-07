const fs = require("fs");
const path = require("path");
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
    }
  }
  next();
});

app.get("/authorized", function (req, res) {
  res.send("Secured Resource");
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

// Serve static files from the "frontend/build" directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Serve static files from the "node_modules" directory
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "../frontend/node_modules"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
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

// Route to create a new user
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user in the database
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    // Send the new user as the response
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Måste Server listening at port:${port}`);
});

// Authorization

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, privateKey, {
      expiresIn: "1h",
      algorithm: "RS256",
    });

    // Send token in the response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Catch-all handler to serve the index.html file for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

async function getUserById(userId) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows[0];
}
