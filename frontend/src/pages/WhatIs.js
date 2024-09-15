import React from "react";
import "./WhatIs.css"; // Import the CSS file for styling
import "../App.css"; // Import the CSS file for styling
import "@clr/icons/clr-icons.min.css";
import { ClarityIcons, atomIcon } from "@cds/core/icon";

// Define the WhatIs component
ClarityIcons.addIcons(atomIcon);

const WhatIs = () => {
  return (
    <div className="text-page">
      <header className="header">
        <h1>What is Måste project ?</h1>
      </header>
      <main className="content">
        <section className="text-section">
          <h2>About Måste</h2>
          <blockquote className="quote">
            " Måste ( Swedish ) - Indicates that there is a requirement for the
            subject of the sentence to do something; expresses necessity."
          </blockquote>
          <ul className="WhatIs_list">
            <li>
              Project title: Multidisciplinära Åtaganden för Sveriges gen-IV
              Teknologi och Expertis
            </li>
            <li>
              Project title in English: Multidisciplinary Commitments for
              Sweden&#39;s Gene IV Technology and Expertise
            </li>
            <li>Project short name: MÅSTE</li>
            <li>
              Coordinator: Chalmers Tekniska Högskola Aktiebolag, Gothenburg,
              Sweden – Prof Christian Ekberg
            </li>
            <li>Duration: May 2024 – December 2027, i. e. 42 months</li>
            <li>Budget: 49,173,321 SEK</li>
            <li>Granting authority: Swedish Energy Agency</li>
            <li>
              Number of partners: 5 research institutions + 1 industrial partner
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default WhatIs;
