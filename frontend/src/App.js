import React from "react";
// import { pushRotate as Menu } from "react-burger-menu";
import Menu2 from "./components/menu2.jsx";
import "./App.css"; // Import your CSS file
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
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

ClarityIcons.addIcons(bellIcon);
ClarityIcons.addIcons(cogIcon);
ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(vmIcon);
ClarityIcons.addIcons(homeIcon);

function App() {
  return (
    <div className="App">
      <Menu2 pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <main id="page-wrap">
        <div id="outer-container">
          {/* Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-links">
                <a href="/">About</a>
                <a href="/">Contact</a>
                <a href="/">Terms of Service</a>
                <a href="/">Privacy Policy</a>
              </div>
              <div className="footer-social">
                <a href="/">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="/">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="/">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
