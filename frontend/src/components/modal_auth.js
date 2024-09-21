import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "@cds/core/icon/register.js";
import "@cds/core/dropdown/register.js";
import "@cds/core/divider/register.js";
import "@cds/core/modal/register.js";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import { ClarityIcons, loginIcon } from "@cds/core/icon";
import "../App.css";
import axios from "axios"; // Import axios

ClarityIcons.addIcons(loginIcon);

const ModalAuth = () => {
  const {
    loginWithRedirect,
    logout,
    isLoading,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  async function handleLogin() {
    try {
      const token = getAccessTokenSilently();
      console.log("Access token:", token);
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  }

  const handleRegister = async () => {
    try {
      await loginWithRedirect({
        screen_hint: "signup",
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope:
          "read:users update:users delete:users create:users read:roles create:roles delete:roles update:roles", // Add other scopes as needed
      });
    } catch (error) {
      console.error("Registration failed:", error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout({ returnTo: window.location.origin });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <React.Fragment>
      <clr-modal clrModalOpen="opened" clrModalSize="sm">
        <clr-modal-footer>
          <cds-icon shape="login"></cds-icon>
          {!isAuthenticated && (
            <button className="btn btn-link" onClick={loginWithRedirect}>
              Login
            </button>
          )}
          {!isAuthenticated && (
            <button className="btn btn-link" onClick={handleRegister}>
              Register
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          )}
        </clr-modal-footer>
      </clr-modal>
    </React.Fragment>
  );
};

export default ModalAuth;
