import React, { useState } from "react";
import "clarity-ui/clarity-ui.min.css";
import "clarity-icons/clarity-icons.min.css";
import "clarity-icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/dropdown/register.js";
import "@cds/core/divider/register.js";
import "@cds/core/modal/register.js";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import { ClarityIcons, loginIcon } from "@cds/core/icon";
import { useAuth } from "../Auth/useAuth"; // Adjust the import path as necessary
import "../App.css";

ClarityIcons.addIcons(loginIcon);

const ModalAuth = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openLoginModal = () => {
    setLoginOpen(true);
    setRegistrationOpen(false);
  };

  const openRegistrationModal = () => {
    setLoginOpen(false);
    setRegistrationOpen(true);
  };

  const closeModal = () => {
    setLoginOpen(false);
    setRegistrationOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithRedirect();
      closeModal();
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout({ returnTo: window.location.origin });
      closeModal();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:10000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      alert("Registration successful!");
      closeModal();
    } catch (error) {
      console.error("Registration failed:", error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  return (
    <React.Fragment>
      <clr-modal
        clrModalOpen={isLoginOpen || isRegistrationOpen ? "opened" : undefined}
        clrModalSize="sm"
      >
        {isLoginOpen && (
          <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <cds-button class="btn btn-primary btn-sm" type="submit">
                Login
              </cds-button>
            </form>
          </div>
        )}
        {isRegistrationOpen && (
          <div>
            <h2>Registration</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <cds-button class="btn btn-primary btn-sm" type="submit">
                Register
              </cds-button>
            </form>
          </div>
        )}
        <clr-modal-footer>
          <cds-icon shape="login"></cds-icon>
          {!isAuthenticated && (
            <button className="btn btn-link" onClick={openLoginModal}>
              Login
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          )}
          {!isAuthenticated && (
            <button className="btn btn-link" onClick={openRegistrationModal}>
              Register
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-link" onClick={closeModal}>
              Close
            </button>
          )}
        </clr-modal-footer>
      </clr-modal>
    </React.Fragment>
  );
};

export default ModalAuth;
