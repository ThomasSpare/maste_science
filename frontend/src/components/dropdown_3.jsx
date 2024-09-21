import React, { useState } from "react";
import "./dropdown.css";
import "clarity-ui/clarity-ui.min.css";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/all-shapes.js";
import "@cds/core/icon/shapes/arrow.js";
import "clarity-icons/clarity-icons.min.css";
import { ClarityIcons, arrowIcon } from "@cds/core/icon";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import "@cds/core/dropdown/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

ClarityIcons.addIcons(arrowIcon);

function Dropdown_3() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth0(); // Get isAuthenticated from AuthContext

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  // Conditionally render the dropdown based on isAuthenticated
  if (!user) {
    return null; // Do not render the dropdown if the user is not authenticated
  }

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
          <Link
            to="/auth-search"
            className="dropdown-item"
          >
            Search PDF Reports
          </Link>
          <Link
            to="/Search-Powerpoint"
            className="dropdown-item"
          >
            Public Reports
          </Link>
          <Link
            to="/Search-Powerpoint"
            className="dropdown-item"
          >
            Search Powerpoints
          </Link>
          <Link
            to="/"
            className="dropdown-item"
          >
            Search Images
          </Link>
          <Link
            to="/Upload"
            className="dropdown-item"
          >
            Upload
          </Link>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">
            Link 1
          </div>
          <div className="dropdown-item">
            Link 2
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_3;