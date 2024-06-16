require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
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

// pool.query(`
//   CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
//   )
// `, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Table created successfully');
//   }
// });
