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

  // Temporarily disable the user authentication check
  // if (!user) {
  //   return null; // Do not render the dropdown if the user is not authenticated
  // }

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
            to="/public_docs"
            className="dropdown-item"
          >
            Public Documents
          </Link>
          <Link
            to="/deliverables_public"
            className="dropdown-item"
          >
            Deliverables (public ones)
          </Link>
          <div className="dropdown-divider"></div>
          <Link
            to="/search"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Search Database
          </Link>
            <Link
            to="/WP1"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP1
            </Link>
            <Link
            to="/WP2"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP2
            </Link>
            <Link
            to="/WP3"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP3
            </Link>
            <Link
            to="/WP4"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP4
            </Link>
            <Link
            to="/WP5"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP5
            </Link>
            <Link
            to="/WP6"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
            >
            WP6
            </Link>
          <Link
            to="/contactlists"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Contact Lists
          </Link>
          <Link
            to="/deliverables"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Deliverables
          </Link>
          <Link
            to="/meetings"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Meetings
          </Link>
          <Link
            to="/promotion"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Promotion materials
          </Link>
          <Link
            to="/publications"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Publications
          </Link>
          <Link
            to="/reports"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Reports
          </Link>
          <Link
            to="/templates"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Templates
          </Link>
          <Link
            to="/Upload"
            className={`dropdown-item ${!user ? "disabled" : ""}`}
          >
            Upload
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_3;