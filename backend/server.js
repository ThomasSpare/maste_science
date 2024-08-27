const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const analytics = google.analyticsreporting("v4");

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.ALLOWED_ORIGINS,
  "https://maste-science-frontend.onrender.com",
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
  res.send("Welcome to the MÅSTE project Database !");
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

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://<your-database-name>.firebaseio.com",
});

// Middleware to check user role
const checkRole = (role) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userRole = (
        await admin.firestore().collection("roles").doc(decodedToken.uid).get()
      ).data().role;

      if (userRole !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

// Uploading files
app.post(
  "/api/uploads",
  checkRole("admin"),
  upload.single("file"),
  (req, res) => {
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
  }
);

app.post("/ppt", checkRole("admin"), ppt.single("file"), (req, res) => {
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

app.post("/pptx", checkRole("admin"), pptx.single("file"), (req, res) => {
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
app.get("/api/uploads/", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM uploads");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/ppt/", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM ppt");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/pptx/", async (_, res) => {
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
      res.status(404).json({ message: "File not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google Analytics
async function getRealTimeUsers(auth) {
  const response = await analytics.reports.batchGet({
    auth: auth,
    requestBody: {
      reportRequests: [
        {
          viewId: "GOOGLE_ANALYTICS_VIEW_ID",
          dateRanges: [
            {
              startDate: "30minutesAgo",
              endDate: "today",
            },
          ],
          metrics: [
            {
              expression: "rt:activeUsers",
            },
          ],
        },
      ],
    },
  });

  return response.data.reports[0].data.totals[0].values[0];
}

// Function to call when you want to display the data on your site
async function displayRealTimeUsers() {
  try {
    const users = await getRealTimeUsers(oauth2Client);
    console.log(`Active users in the last 30 minutes: ${users}`);
    // Here you would send the users variable to your frontend to be displayed
  } catch (error) {
    console.error("Error fetching real-time users:", error);
  }
}

// Assuming you have set up OAuth2 authentication
const oauth2Client = new google.auth.OAuth2(
  "GOOGLE_ANALYTICS_CLIENT_ID",
  "GOOGLE_ANALYTICS_CLIENT_SECRET",
  "GOOGLE_ANALYTICS_REDIRECT_URI"
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

  // Validate username and password and fetch user
  // ...

  // Generate token
  const token = jwt.sign({ userId: user.id }, "your-token");

  // Send token in the response
  res.json({ token });
});

// Authentication middleware
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, "your-token");
      req.user = await getUserById(payload.userId);
    } catch (err) {
      console.error(err);
    }
  }

  next();
});

// Authorized route
app.get("/protected", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Process request
});

// Catch-all handler to serve the index.html file for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// To Create new tables in DB, only run once
// pool.query(
//   `
//   CREATE TABLE pptx (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
//   )
// `,
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Table created successfully");
//     }
//   }
// );

// pool.query(
//   `
//   ALTER TABLE uploads/ppt
//   DELETE COLUMN username VARCHAR(255)
//   `,
//   (err, res) => {
//     if (
