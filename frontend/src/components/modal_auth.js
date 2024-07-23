import React, { useState } from "react";
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js";
import { ClarityIcons, loginIcon } from "@cds/core/icon";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";
import "@cds/core/modal/register.js";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import { register, login, logout } from "../Auth/Auth.js"; // Adjust the import path as necessary

ClarityIcons.addIcons(loginIcon);

function ModalAuth() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    e.preventDefault(); // Prevent default form submission
    try {
      await register(email, password);
      setIsRegistered(true);
      alert("Registration successful!"); // Show a success message to the user
      closeModal(); // Close modal on successful registration
      // Optionally, reset email and password state here
    } catch (error) {
      console.error("Registration failed:", error);
      // Optionally, handle errors (e.g., show an error message)
      alert("Registration failed. Please try again."); // Show an error message to the user
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setIsRegistered(true);
      alert("Login successful!"); // Show a success message to the user
      closeModal(); // Close modal on successful login
      // Optionally, reset email and password state here
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again."); // Show an error message to the user
      // Optionally, handle errors (e.g., show an error message)
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      closeModal(); // Close modal on successful logout
      // Optionally, perform any additional cleanup (e.g., reset state)
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, handle errors (e.g., show an error message)
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
            {/* Registration form */}
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
          <button className="btn btn-link" onClick={openLoginModal}>
            Login
          </button>
          <cds-icon shape="login"></cds-icon>
          {IsLoggedIn && (
            <button className="btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          )}
          {!IsLoggedIn && !isRegistered && (
            <button className="btn btn-link" onClick={openRegistrationModal}>
              Register
            </button>
          )}
          <button className="btn btn-link" onClick={closeModal}>
            Close
          </button>
        </clr-modal-footer>
      </clr-modal>
    </React.Fragment>
  );
}
export default ModalAuth;
