import React from "react";
import "./Contacts.css"; // Import the CSS file for styling
import "../App.css"; // Import the CSS file for styling
import "@clr/icons/clr-icons.min.css";
import { ClarityIcons, atomIcon } from "@cds/core/icon";

// Define the WhatIs component
ClarityIcons.addIcons(atomIcon);

const Contacts = () => {
  return (
    <div className="text-page">
      <header className="header">
        <h1>Contacts</h1>
      </header>
        <main className="content">
            <section className="contacts-text-section">
            <h2>Coordinator</h2>
            <p>
                Prof. Christian Ekberg
                <br />
                Professor, Stena’s chair in Industrial Materials Recycling
                <br />
                Professor Nuclear Chemistry
                <br />
                Head of Energy and Materials division
                <br />
                Department of Chemistry and Chemical Engineering
                <br />
                Chalmers Tekniska Högskola Aktiebolag
                <br />
                SE-412 96 Göteborg, Sweden
                <br />
                Email:
                <a href="mailto:che@chalmers.se">che@chalmers.se
                    </a>
                Tel: +46-31-7722801
            </p>
            </section>
      </main>
    </div>
    
  );
};

export default Contacts;
