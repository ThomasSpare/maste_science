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
const AWS = require("aws-sdk");

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Function to alter the table and add the file_key column
const alterTable = async () => {
  try {
    const query =
      "ALTER TABLE uploads ADD COLUMN IF NOT EXISTS file_key VARCHAR(255)";
    await pool.query(query);
    console.log("Table altered successfully");
  } catch (error) {
    console.error("Error altering table:", error);
  }
};

// Call the function to alter the table
alterTable();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to upload files
app.post("/api/uploads", upload.single("file"), async (req, res) => {
  const { author, uploadDate, country, category } = req.body;
  const file = req.file;

  console.log("Received data:", {
    author,
    uploadDate,
    country,
    category,
    file,
  });

  if (!file || !author || !uploadDate || !country || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const fileKey = `${Date.now()}_${file.originalname}`;
  console.log("Generated fileKey:", fileKey);

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();
    const fileUrl = uploadResult.Location;

    // Insert file metadata into PostgreSQL
    const query =
      "INSERT INTO uploads (author, upload_date, country, category, file_url, file_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [author, uploadDate, country, category, fileUrl, fileKey];
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
    res.setHeader("Content-Type", file.ContentType);
    res.send(file.Body);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
