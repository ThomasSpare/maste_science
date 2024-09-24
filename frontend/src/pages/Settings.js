import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Settings.css";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import { ClarityIcons, contractIcon } from "@cds/core/icon";

ClarityIcons.addIcons(contractIcon);

const Dashboard = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    fetchLastThreePosts();
  }, []);

  const fetchLastThreePosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/news?limit=3`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

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
        `${process.env.REACT_APP_API_BASE_URL}/api/news`,
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
      fetchLastThreePosts(); // Refresh the posts
    } catch (error) {
      console.error("Error adding news article:", error);
      alert("Failed to add news article");
    }
  };

  const handleDeletePost = async (postId) => {
    console.log("Deleting post with ID:", postId); // Log the postId
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/news/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post deleted successfully");
      fetchLastThreePosts(); // Refresh the posts
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleEditPost = (post) => {
    setEditPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImage(null); // Reset image as we don't have the image file
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = await getAccessTokenSilently();
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/news/${editPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post updated successfully");
      setTitle("");
      setContent("");
      setImage(null);
      setEditPostId(null);
      fetchLastThreePosts(); // Refresh the posts
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  return (
    <div className="Settings">
      <h1>NEWS</h1>
      <div className="status">
        <p>Welcome, {user ? user.name : "Guest"}</p>
        <p>You have the role: Admin</p>
      </div>
      <div>
        <p>You have admin access and can post news</p>
        <div className="news-form">
          <h2>{editPostId ? "Edit News" : "Write some News about Måste !"}</h2>
          <form onSubmit={editPostId ? handleUpdatePost : handleNewsSubmit}>
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
            <button type="submit">
              {editPostId ? "Update News Post" : "Add News Post"}
            </button>
          </form>
        </div>
        <div className="news-list">
          <h2>Last 3 News Posts</h2>
          {posts.map((post) => (
            <div key={post._id} className="news-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt={post.title} />}
              <button onClick={() => handleEditPost(post)}>Edit</button>
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
