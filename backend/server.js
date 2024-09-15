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

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to add news
app.post("/api/news", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file;

  if (!title || !content || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const imageKey = `${Date.now()}_${image.originalname}`;
  const params = {
    Bucket: bucketName,
    Key: imageKey,
    Body: image.buffer,
    ContentType: image.mimetype,
  };

  try {
    // Upload image to S3
    const uploadResult = await s3.upload(params).promise();
    const imageUrl = uploadResult.Location;

    // Insert news metadata into PostgreSQL
    const query =
      "INSERT INTO news (title, content, image_url, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *";
    const values = [title, content, imageUrl];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "News article added successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding news article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to get news
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
