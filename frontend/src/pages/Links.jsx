import React from "react";
import "./Links.css"; // Import the CSS file for styling
import "../App.css"; // Import the CSS file for styling



const Links = () => {
  const links = [
    { name: "Link 1", url: "https://example.com/1" },
    { name: "Link 2", url: "https://example.com/2" },
    { name: "Link 3", url: "https://example.com/3" },
    { name: "Link 4", url: "https://example.com/4" },
    { name: "Link 5", url: "https://example.com/5" },
    { name: "Link 6", url: "https://example.com/6" },
    { name: "Link 7", url: "https://example.com/7" },
    { name: "Link 8", url: "https://example.com/8" },
    { name: "Link 9", url: "https://example.com/9" },
    { name: "Link 10", url: "https://example.com/10" },
    { name: "Link 11", url: "https://example.com/11" },
    { name: "Link 12", url: "https://example.com/12" },
    { name: "Link 13", url: "https://example.com/13" },
    { name: "Link 14", url: "https://example.com/14" },
    { name: "Link 15", url: "https://example.com/15" },
    { name: "Link 16", url: "https://example.com/16" },
    { name: "Link 17", url: "https://example.com/17" },
    { name: "Link 18", url: "https://example.com/18" },
    { name: "Link 19", url: "https://example.com/19" },
    { name: "Link 20", url: "https://example.com/20" },
  ];

  return (
    <div className="text-page">
      <header className="header">
        <h1>Useful Links</h1>
      </header>
      <main className="content">
        <section className="text-section">
          <ul className="WhatIs_list">
            {links.map((link, index) => (
              <li key={index} className="link-item">
                <a href={link.url} id="Useful_Links" target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Links;