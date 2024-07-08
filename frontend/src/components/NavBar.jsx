import Marquee from "react-marquee";
import React from "react";
import "../App.css";
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
} from "@cds/core/icon";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import Dropdown_1 from "./dropdown_1.js";
import Dropdown_2 from "./dropdown_2.js";
import Dropdown_3 from "./dropdown_3.js";
import Dropdown_4 from "./dropdown_4.js";
import Dropdown_5 from "./dropdown_5.js";
import Dropdown_6 from "./dropdown_6.js";
import menu2 from "./menu2.js";
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal_auth from "./modal_auth.js";

ClarityIcons.addIcons(bellIcon);
ClarityIcons.addIcons(cogIcon);
ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(vmIcon);
ClarityIcons.addIcons(homeIcon);

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRegister = () => {
    // Perform registration logic here
    // If registration is successful, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  const handleLogin = () => {
    // Perform login logic here
    // If login is successful, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform logout logic here
    // If logout is successful, set isLoggedIn to false
    setIsLoggedIn(false);
  };
  const checkboxRef = useRef(null);

  const handleCheckboxChange = () => {
    document.body.classList.toggle("dark");
  };


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
                <Modal_auth />
                <form className="search" onSubmit={handleSearch}>
                    <input
                      id="search-input-sidenav-ng"
                      type="text"
                      placeholder="Search for keywords..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <a href="/" className="nav-link nav-icon">
                    <cds-icon shape="cog" type="submit">Search</cds-icon>
                  </a>
                </form>
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
                  <a href="javascript://" className="nav-link nav-icon">
                    <cds-icon shape="vm"></cds-icon>
                  </a>
                  <a href="javascript://" className="nav-link nav-icon">
                    <cds-icon shape="bell"></cds-icon>
                  </a>
                  <a href="/auth" className="nav-link nav-icon">
                    <cds-icon shape="user"></cds-icon>
                  </a>
                  <a href="javascript://" className="nav-link nav-icon">
                    <cds-icon shape="cog"></cds-icon>
                  </a>
                </div>
              </header>
              <nav className="subnav">
              <Marquee direction="left" speed={20}>
                <p style="font-size: 30px">This is a rolling text from right to left.</p>
              </Marquee>
                <ul className="nav">
                  <Dropdown_1 />
                  <Dropdown_2 />
                  <Dropdown_3 />
                  <Dropdown_4 />
                  <Dropdown_5 />
                  <Dropdown_6 />
                </ul>
                <img
                  className="logo"
                  src="https://res.cloudinary.com/djunroohl/image/upload/v1715630359/f%C3%A4rglogo4x_rmokzf.png"
                  alt="logo"
                />
              </nav>
            </div>

            {/* Hero image */}
          {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
              ) : (
                  <button onClick={handleLogin}>Login</button>
                  )}
          <button onClick={handleRegister}>Register</button>


          </header>
  );
}

export default NavBar;

