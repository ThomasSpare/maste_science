const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the MÅSTE project Database !");
});

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

const upload = multer({ dest: "uploads/" });

app.post("/api/uploads", upload.single("file"), (req, res) => {
  const { author, uploadDate, country, category } = req.body;
  pool.query(
    // Had type error here 'port' instead of 'pool'
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
  console.log(`Server listening at http://localhost:${port}`);
});

// Authorisation

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

// To Create new tables in DB, only run once

// pool.query(
//   `
//   CREATE TABLE uploads (
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
//   ALTER TABLE uploads
//   DELETE COLUMN username VARCHAR(255)
//   `,
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Column added successfully");
//     }
//   }
// );

// pool.query(
//   `
//   ALTER TABLE uploads
//   DROP COLUMN password
//   `,
//   (err, res) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log("Column removed successfully");
//     }
//   }
// );

app.get("/api/tables", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.table_schema, t.table_name, array_agg(c.column_name) as columns
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
      WHERE t.table_schema = 'public'
      GROUP BY t.table_schema, t.table_name
    `);
    res.json(
      result.rows.map((row) => ({
        schema: row.table_schema,
        table: row.table_name,
        columns: row.columns,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/tables/uploads", upload.single("file"), async (req, res) => {
  try {
    const { author, uploadDate, country, category } = req.body;
    const result = await pool.query(
      `
      INSERT INTO uploads (file, author, uploadDate, country, category) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
      [req.file.filename, author, uploadDate, country, category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
