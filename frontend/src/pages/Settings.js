import React, { useState, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Settings.css";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import { ClarityIcons, contractIcon } from "@cds/core/icon";
import { useNavigate } from "react-router-dom";

ClarityIcons.addIcons(contractIcon);

const Dashboard = () => {
  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
    useAuth0();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();

  const allowedEmails = useMemo(
    () => ({
      "che@chalmers.se": "Christian Ekberg",
      "tretegan@chalmers.se": "Teodora Retegan Vollmer",
      "demaz@chalmers.se": "Christophe Demazière",
      "sophie.grape@physics.uu.se": "Sophie Grape",
      "mattias.thuvander@chalmers.se": "Mattias Thuvander",
      "charlotta.nilsson@fysik.lu.se": "Charlotta Nilsson",
      "jana.peroutkova@evalion.cz": "Jana Peroutková",
      "petr.koran@evalion.cz": "Petr Kořán",
      "t.spare.jkpg@gmail.com": "Thomas Spåre",
    }),
    []
  );

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect();
      } else {
        setIsAuthenticatedState(true);
      }
    };
    checkAuthentication();
  }, [isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticatedState) {
      if (user && user.email in allowedEmails) {
        setIsAuthorized(true);
        fetchLastThreePosts();
      } else {
        setIsAuthorized(false);
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticatedState, user, navigate, allowedEmails]);

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
    formData.append("author", allowedEmails[user.email]);

    try {
      await axios.post(
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
      fetchLastThreePosts();
    } catch (error) {
      console.error("Error adding news article:", error);
      alert("Failed to add news article");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/news/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post deleted successfully");
      fetchLastThreePosts();
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  const handleEditPost = (post) => {
    setEditPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setImage(null);
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
    formData.append("author", user.name);

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
      fetchLastThreePosts();
    } catch (error) {
      alert("Failed to update post");
    }
  };

  if (!isAuthorized) {
    return <div>Unauthorized access</div>;
  }

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
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link", "image", "video"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "video",
                ]}
                placeholder="News Content"
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
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              {post.image && <img src={post.image} alt={post.title} />}
              <p>Author: {post.author}</p>
              <button onClick={() => handleEditPost(post)}>Edit</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
