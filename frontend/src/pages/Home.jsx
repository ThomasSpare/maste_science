import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useAuth0 } from '@auth0/auth0-react';
import "@cds/core/button/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/dropdown/register.js";
import "@cds/core/divider/register.js";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "../App.css";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "read:news read:files",
          }
        });

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', tokenPayload);
        console.log('Token permissions:', tokenPayload.permissions || 'No permissions found');

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL || ''}/api/news`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [getAccessTokenSilently]);

  return (
    <div className="App">
      <div id="outer-container">
        <main id="page-wrap">
          <main className="text">
            <section className="columns">
              <div className="column">
                <img
                  className="home_image1"
                  src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,h_1701,w_600/v1720396474/greenfields_jcajzf.jpg"
                  alt="Green fields"
                />
              </div>
              <div className="column">
                <h1 style={{ color: "white", 
                backgroundColor: "lightcoral", 
                height: "30px",
                borderRadius: "6px",
                padding: "5px" }} 
                className="home-headline">Ongoing Maintenance of the site </h1>
                <div>
                  <p className="home-text">
                    The project Multidisciplinära Åtaganden för Sveriges gen-IV
                    Teknologi och Expertis (Multidisciplinary Commitments for
                    Sweden&#39;s Gene IV Technology and Expertise), MÅSTE, lays
                    the foundation for real understanding of the knowledge and
                    challenges for the implementation of a Gen IV electricity
                    production system. <br></br>
                    <br></br> It also works as a ground for increasing the base
                    line of younger scientist and professionals in the radiation
                    science sector bringing a huge benefit for Sweden. MÅSTE not
                    only brings the ability to continue the existing nuclear
                    fleet but it is also the corner stone for any new build
                    power system and replies to other needs such as radiological
                    awareness, protection and hospital capabilities.
                    <br></br>
                    <br></br> MÅSTE promotes the younger research leaders and,
                    in this way, contributes to sustainability of the high
                    academic level at the Swedish universities where many senior
                    researchers will retire in the next 1-2 decades.
                  </p>
                </div>
                <section className="news-section">
                  <h2 className="news-headline">Latest News</h2>
                  {Array.isArray(news) ? (
                    news.map((article) => (
                      <div key={article.id} className="news-article" style={{marginLeft: "12vw"}} >  
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="news-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "frontend/public/landscape-placeholder-svgrepo-com.svg";
                          }}
                        />
                        <div className="news-content">
                          <h3>{article.title}</h3>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: article.content.length > 200
                                ? `${article.content.substring(0, 200)}...`
                                : article.content,
                            }}
                          />
                          <Link to={`/news/${article.id}`}> read more</Link>
                          <p className="news-date">
                            {new Date(article.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No news available</p>
                  )}
                </section>
              </div>
              <div className="column">
                <img
                  className="home_image2"
                  src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,e_improve,g_auto,h_1707,w_600,x_0/v1720396474/greenfields_jcajzf.jpg"
                  alt="Green fields"
                />
              </div>
            </section>
          </main>
        </main>
      </div>
    </div>
  );
}

export default Home;