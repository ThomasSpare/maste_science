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
import { register, login, logout } from "../Auth/Auth.js"; // Adjust the import path as necessary
import { useAuth } from "../Auth/AuthContext.js";

ClarityIcons.addIcons(loginIcon);

const ModalAuth = () => {
  const { isLoggedIn } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      setIsRegistered(true);
      alert("Registration successful!");
      closeModal();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsRegistered(true);
      alert("Login successful!");
      closeModal();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeModal();
    } catch (error) {
      console.error("Logout failed:", error);
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
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <cds-button class="btn btn-primary btn-sm" type="submit">
                Register
              </cds-button>
            </form>
          </div>
        )}
        <clr-modal-footer>
          <cds-icon shape="login"></cds-icon>
          {!isLoggedIn && (
            <button className="btn btn-link" onClick={openLoginModal}>
              Login
            </button>
          )}
          {isLoggedIn && (
            <button className="btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          )}
          {!isLoggedIn && !isRegistered && (
            <button className="btn btn-link" onClick={openRegistrationModal}>
              Register
            </button>
          )}
          {!isLoggedIn && isRegistered && (
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
