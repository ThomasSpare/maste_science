import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


import "@cds/core/dropdown/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

function Dropdown_2() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          News & Events
          <clr-icon shape="caret down"></clr-icon>
        </button>
        <div className="dropdown-menu">
          <h4 className="dropdown-header">WHAT'S GOING ON</h4>
          <Link
            to="/allnews"
            className="dropdown-item"
          >
            News
          </Link>
          {/* <Link
            to="/events"
            className="dropdown-item"
          >
            Events
          </Link> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_2;
