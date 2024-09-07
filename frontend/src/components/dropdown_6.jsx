import React from "react";
import { useState } from "react";

import "@cds/core/dropdown/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

function Dropdown_6() {
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
          CONTACTS
          <clr-icon shape="caret down"></clr-icon>
        </button>
        <div className="dropdown-menu">
          <h4 className="dropdown-header">Dropdown header</h4>
          <div className="dropdown-item">First Action</div>
          <div className="dropdown-item">Disabled Action</div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">Link 1</div>
          <div className="dropdown-item">Link 2</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_6;
