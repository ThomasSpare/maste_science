import React from "react";
import { pushRotate as Menu } from "react-burger-menu";
import "./App.css"; // Import your CSS file
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
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
import "@cds/core/button/register.js";
import "./App.css"; // Import your CSS file
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import { useRef, useState } from "react";
import Modal_auth from "./components/modal_auth.js";

ClarityIcons.addIcons(bellIcon);
ClarityIcons.addIcons(cogIcon);
ClarityIcons.addIcons(userIcon);
ClarityIcons.addIcons(vmIcon);
ClarityIcons.addIcons(homeIcon);

function App() {
  return (
    <div className="App">
      <div id="outer-container">
        <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
        <main id="page-wrap">
          {/* Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-links">
                <a href="javascript:void(0)">About</a>
                <a href="javascript:void(0)">Contact</a>
                <a href="javascript:void(0)">Terms of Service</a>
                <a href="javascript:void(0)">Privacy Policy</a>
              </div>
              <div className="footer-social">
                <a href="javascript:void(0)">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="javascript:void(0)">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="javascript:void(0)">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
