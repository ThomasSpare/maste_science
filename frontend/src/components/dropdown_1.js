import React from "react";
import { useState } from "react";
import "@cds/core/dropdown/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

function Dropdown_1() {
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
          OVERVIEW
          <clr-icon shape="caret down"></clr-icon>
        </button>
        <div className="dropdown-menu">
          <h4 className="dropdown-header">About Måste</h4>
          <div className="dropdown-item active">What is Måste ?</div>
          <div className="dropdown-item disabled">What is our Aim ?</div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">WPs</div>
          <div className="dropdown-item">Project Bodies</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_1;
