import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CdsButton } from '@cds/react/button';
import axios from "axios";
import "./SelectedNews.css"; // Import the CSS file for styling

const SelectedNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/news/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-page">
      <header className="header">
        <h1>{article.title}</h1>
      </header>
      <main className="content">
        <img
          style={{ padding: "2px", borderRadius: "5px" }}
          src={article.image_url}
          alt={article.title}
          className="news-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
        <div
          className="news-card"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <div className="news-info">
          <p className="news-date">
            {new Date(article.created_at).toLocaleDateString()}
          </p>
          <p className="news-author">
            By {article.author}
          </p>
<CdsButton onClick={() => navigate(-1)} className="back-button">Back</CdsButton>
        </div>
      </main>
    </div>
  );
};

export default SelectedNews;