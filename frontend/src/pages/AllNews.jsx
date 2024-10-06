import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHref } from "react-router-dom";
import "./AllNews.css"; // Import the CSS file for styling
import { CdsButton } from "@cds/react/button";

const AllNews = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/news`);
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, []);

    const stripHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const truncateContent = (content, maxLength = 200) => {
        const strippedContent = stripHtml(content);
        if (strippedContent.length > maxLength) {
            return strippedContent.substring(0, maxLength) + "...";
        }
        return strippedContent;
    };

    if (articles.length === 0) {
        return (
            <div className="go-back">
                No News here at the moment...
                <Link to="/"><CdsButton>Go back</CdsButton></Link>
            </div>
        );
    }

    return (
        <div className="text-page">
            <header className="header">
                <h1>All News</h1>
            </header>
            <main className="content">
                {articles.map((article) => (
                    <div key={article.id} className="news-article">
                        <img
                            style={{ borderStyle: "double", padding: "2px", borderRadius: "5px" }}
                            src={article.image_url}
                            alt={article.title}
                            className="news-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                        <h2>{article.title}</h2>
                        <div className="news-card">
                            <p>{truncateContent(article.content)}</p>
                        </div>
                        <div className="news-info">
                            <p className="news-date">
                                {new Date(article.created_at).toLocaleDateString()}
                            </p>
                            <p className="news-author">By {article.author}</p>
                            <Link to={`/news/${article.id}`}>Read more</Link>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default AllNews;