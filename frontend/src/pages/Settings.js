import React, { useState } from "react";
import { useAuth } from "../Auth/useAuth";
import axios from "axios";
import "./Settings.css";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import { ClarityIcons, contractIcon } from "@cds/core/icon";

ClarityIcons.addIcons(contractIcon);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !image) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:10000/api/news",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("News article added successfully");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (error) {
      console.error("Error adding news article:", error);
      alert("Failed to add news article");
    }
  };

  return (
    <div className="Settings">
      <h1>Dashboard</h1>
      <div className="status">
        <p>Welcome, {user ? user.name : "Guest"}</p>
        <p>You have the role: {hasRole("admin") ? "Admin" : "User"}</p>
      </div>
      {
        <div>
          <p>You have admin access and can post news</p>
          <div className="news-form">
            <h2>Write some News</h2>
            <form onSubmit={handleNewsSubmit}>
              <div>
                <label style={{ padding: "20px", color: "black" }}>
                  <cds-icon shape="contract" size="lg"></cds-icon>
                  &nbsp;&nbsp;&nbsp;&nbsp; News Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <textarea
                  placeholder="News Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <label>News Image</label>
                <input
                  style={{ color: "#000000cf, !important" }}
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <button type="submit">Add News Post</button>
            </form>
          </div>
        </div>
      }
    </div>
  );
};

export default Dashboard;
