import React, { useState } from "react";
import { useAuth } from "../Auth/useAuth";
import axios from "axios";

const Dashboard = () => {
  const { user, logout, hasRole } = useAuth();
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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user ? user.name : "Guest"}</p>
      <p>You have the role: {hasRole("admin") ? "Admin" : "User"}</p>
      {
        <div>
          <p>You have admin access</p>
          <form onSubmit={handleNewsSubmit}>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div>
              <label>Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <button type="submit">Add News</button>
          </form>
        </div>
      }
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
