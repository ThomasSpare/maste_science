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
          Resources
          <clr-icon shape="caret down"></clr-icon>
        </button>
        <div
          className={`dropdown-menu ${isDropdownOpen ? "fade-in" : ""}`}
          onMouseEnter={handleDropdownToggle}
          onMouseLeave={handleDropdownClose}
        >
          <h4 className="dropdown-header">Dropdown header</h4>
          <div className="dropdown-item active">First Action</div>
          <div className="dropdown-item disabled">Disabled Action</div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">Link 1</div>
          <div className="dropdown-item">Link 2</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_1;
