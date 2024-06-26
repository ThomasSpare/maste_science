import React from "react";
import { useState } from "react";
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/all-shapes.js";
import "@cds/core/icon/shapes/arrow.js";
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import { ClarityIcons, arrowIcon } from "@cds/core/icon";

import "@cds/core/dropdown/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

ClarityIcons.addIcons(arrowIcon);

function Dropdown_3() {
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
          <clr-icon shape="arrow" dir="down"></clr-icon>
        </button>
        <div className="dropdown-menu">
          <h4 className="dropdown-header">MÅSTE DATABASE</h4>
          <a href="/Search" className="dropdown-item">
            Search
          </a>
          <a href="/Upload" className="dropdown-item">
            Upload
          </a>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item">Link 1</div>
          <div className="dropdown-item">Link 2</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dropdown_3;
