import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../Auth/useAuth";
import "../App.css";
import "../components/NavBar.css";
import { useLocation } from "react-router-dom";
import "clarity-ui/clarity-ui.min.css";
import "clarity-icons/clarity-icons.min.css";
import "clarity-icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/dropdown/register.js";
import "@cds/core/divider/register.js";
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
import ModalAuth from "./modal_auth.js";
import Dropdown1 from "./dropdown_1.jsx";
import Dropdown2 from "./dropdown_2.jsx";
import Dropdown3 from "./dropdown_3.jsx";
import Dropdown4 from "./dropdown_4.jsx";
import Dropdown5 from "./dropdown_5.jsx";
import Dropdown6 from "./dropdown_6.jsx";

ClarityIcons.addIcons(bellIcon);
ClarityIcons.addIcons(cogIcon);
ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(vmIcon);
ClarityIcons.addIcons(homeIcon);
ClarityIcons.addIcons(searchIcon);
ClarityIcons.addIcons(thumbsUpIcon);

function NavBar() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!(location.pathname === '/')) {
      setShowLogo(false);
    } else {
      setShowLogo(true);
    }
  }, [location]);

  const checkboxRef = useRef(null);

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
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="App-header">
      <div className="main">
        <header className="header header-6">
          <div className="branding">
            <a href="/" className="title">MÅSTE</a>
          </div>
          <form className="search" onSubmit={handleSearch}>
            <input
              id="search-input-sidenav-ng"
              type="text"
              placeholder="Search for keywords..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="nav-link nav-icon">
              <cds-icon shape="search">
                Search
              </cds-icon>
            </button>
          </form>
          {isAuthenticated && (
            <div className="currentUser">
              <cds-icon shape="thumbs-up"></cds-icon>
              <span className="display_email">
                Logged in as {user?.email || "Guest"}
              </span>
            </div>
          )}
          <ModalAuth isLoggedIn={isAuthenticated} />
          <div className="settings">
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
            {!isAuthenticated && (
              <a href="/settings" className="nav-link nav-icon">
                <cds-icon shape="cog"></cds-icon>
              </a>
            )}
          </div>
        </header>
        <nav className="subnav">
          <ul className="nav">
            <Dropdown1 />
            <Dropdown2 />
            <Dropdown3 isLoggedIn={!isAuthenticated} />
            <Dropdown4 />
            <Dropdown5 />
            <Dropdown6 />
          </ul>
          {showLogo && (
            <img
              className="logo"
              src="https://res.cloudinary.com/djunroohl/image/upload/v1725996744/M%C3%85STE_2x_wwaat9.png"
              alt="logo"
            />
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;