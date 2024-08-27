import Marquee from "react-marquee";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import "../App.css";
import "../components/NavBar.css";
import { useLocation } from "react-router-dom";
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import {
  ClarityIcons,
  userIcon,
  bellIcon,
  cogIcon,
  homeIcon,
  vmIcon,
  searchIcon,
  thumbsUpIcon,
} from "@cds/core/icon";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import ModalAuth from "./modal_auth.js";
import Dropdown_1 from "./dropdown_1.js";
import Dropdown_2 from "./dropdown_2.js";
import Dropdown_3 from "./dropdown_3.js";
import Dropdown_4 from "./dropdown_4.js";
import Dropdown_5 from "./dropdown_5.js";
import Dropdown_6 from "./dropdown_6.js";
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";

ClarityIcons.addIcons(bellIcon);
ClarityIcons.addIcons(cogIcon);
ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(vmIcon);
ClarityIcons.addIcons(homeIcon);
ClarityIcons.addIcons(searchIcon);
ClarityIcons.addIcons(thumbsUpIcon);

function NavBar(isLoggedIn) {
  const {currentUser} = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [showLogo, setShowLogo] = useState(true);
  const location = useLocation();


  useEffect(() => {
    if (!(location.pathname === '/')) { // Only on the home page
      setShowLogo(false); // Hide the logo
    } else {
      setShowLogo(true); // Show the logo on other pages
    }
  }, [location]); // Re-run the effect when the location changes

  const checkboxRef = useRef(null);

  // Dark-Light Mode

  const handleCheckboxChange = () => {
    const isDarkMode = document.body.classList.toggle("dark");
      localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      document.body.classList.add("dark");
    }
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search logic here
    // For example, you could filter your site's content based on `searchQuery`
    // and then display the results.
    console.log('Searching for:', searchQuery);
    // You might navigate to a search results page or filter content on the current page.
  };

  return (
          <header className="App-header">
            <div className="main">
              <header className="header header-6">
                <div className="branding">
                  <span className="title">MÅSTE</span>
                </div>
                <form className="search" onSubmit={handleSearch}>
                    <input
                      id="search-input-sidenav-ng"
                      type="text"
                      placeholder="Search for keywords..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <a href="/" className="nav-link nav-icon">
                    <cds-icon shape="search" type="submit">Search</cds-icon>
                  </a>
                </form>
                {isLoggedIn && currentUser && currentUser.email && (

                  <div className="currentUser">
                    <cds-icon shape="thumbs-up"></cds-icon>
                    <span className="display_email">
                      Logged in as {currentUser.email}
                    </span>
                  </div>
                )}
                <ModalAuth isLoggedIn={isLoggedIn} />
                <div className="settings">
                  {/* Light-Dark Mode */}
                  <input
                    type="checkbox"
                    className="checkbox"
                    id="checkbox"
                    ref={checkboxRef}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="checkbox" className="checkbox-label">
                    <i className="fas fa-moon"></i>
                    <i className="fas fa-sun"></i>
                    <div className="ball"></div>
                  </label>

                  <a href="/" className="nav-link nav-icon">
                    <cds-icon shape="home"></cds-icon>
                  </a>           
                  <a href="/settings" className="nav-link nav-icon">
                    <cds-icon shape="cog"></cds-icon>
                  </a>
                </div>
              </header>
              <nav className="subnav">
                <ul className="nav">
                  <Dropdown_1 />
                  <Dropdown_2 />
                  <Dropdown_3 isLoggedIn={isLoggedIn} />
                  <Dropdown_4 />
                  <Dropdown_5 />
                  <Dropdown_6 />
                </ul>
                {showLogo && <img className="logo"
                  src="https://res.cloudinary.com/djunroohl/image/upload/v1721858132/M%C3%A5ste_hill_logo_morprz.png"
                  alt="logo" />}
              </nav>
            </div>        
          </header>
  );
}

export default NavBar;

