import React, { useState } from "react";
import "./dropdown.css";
import "clarity-ui/clarity-ui.min.css";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/all-shapes.js";
import "@cds/core/icon/shapes/arrow.js";
import "clarity-icons/clarity-icons.min.css";
import { ClarityIcons, arrowIcon } from "@cds/core/icon";
import { useAuth } from "../Auth/useAuth";

import "@cds/core/dropdown/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

ClarityIcons.addIcons(arrowIcon);

function Dropdown_3() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn } = useAuth(); // Get isLoggedIn from AuthContext

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <React.Fragment>
      <div
        className={`dropdown bottom-right ${isDropdownOpen ? "open" : ""}`}
        onMouseLeave={handleDropdownClose}
      >
        <button
          className="dropdown-toggle btn btn-link"
          onMouseEnter={handleDropdownToggle}
        >
          DOCUMENTS
          <clr-icon shape="arrow" dir="down"></clr-icon>
        </button>
        <div className="dropdown-menu">
          <h4 className="dropdown-header">MÅSTE DATABASE</h4>
          {/* Conditionally render links based on isLoggedIn */}
          <a
            href="/Search"
            className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
          >
            Search PDF Reports
          </a>
          <a
            href="/Search-Powerpoint"
            className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
          >
            Search Powerpoints
          </a>
          <a
            href="/"
            className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
          >
            Search Images
          </a>
          <a
            href="/Upload"
            className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}
            onClick={(e) => !isLoggedIn && e.preventDefault()}
          >
            Upload
          </a>
          <div className="dropdown-divider"></div>
          <div className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}>
            Link 1
          </div>
          <div className={`dropdown-item ${isLoggedIn ? "" : "disabled"}`}>
            Link 2
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_3;
