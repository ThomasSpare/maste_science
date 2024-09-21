import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LayOut from "./components/LayOut";
import Aims from "./pages/Aims";
import Links from "./pages/Links";
import Partners from "./pages/Partners";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import ViewPdf from "./pages/ViewPdf";
import ModalAuth from "./components/modal_auth";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import SearchPowerPoint from "./pages/SearchPowerPoint";
import WhatIs from "./pages/WhatIs";
import Settings from "./pages/Settings";
import ViewPpt from "./pages/ViewPpt";

import Auth0ProviderWithHistory from "./Auth/Auth0Provider";
import WS from "./pages/WorkStructure";

function ProtectedRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/auth" />;
}

function AuthForm({ onPasswordSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  const handlePasswordSubmit = (password) => {
    const correctPassword = process.env.REACT_APP_PASSWORD;
    console.log("Submitted Password:", password);
    console.log("Correct Password:", correctPassword);
    if (password === correctPassword) {
      setIsAuthenticated(true);
      navigate("/Upload"); // Redirect to /Upload upon successful password submission
    } else {
      alert("Incorrect password");
    }
  };

  const handleSearchPasswordSubmit = (password) => {
    const correctSearchPassword = process.env.REACT_APP_SEARCH_PASSWORD;
    console.log("Submitted Search Password:", password);
    console.log("Correct Search Password:", correctSearchPassword);
    if (password === correctSearchPassword) {
      setIsAuthenticated(true);
      navigate("search"); // Redirect to /search upon successful password submission
    } else {
      alert("Incorrect password");
    }
  };

  const handleSettingsPasswordSubmit = (password) => {
    const correctSettingsPassword = process.env.REACT_APP_SETTINGS_PASSWORD;
    console.log("Submitted Settings Password:", password);
    console.log("Correct Settings Password:", correctSettingsPassword);
    if (password === correctSettingsPassword) {
      setIsAuthenticated(true);
      navigate("settings"); // Redirect to /settings upon successful password submission
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LayOut />}>
        <Route index element={<Home />} />
        <Route path="What_is_Maste" element={<WhatIs />} />
        <Route path="Aims" element={<Aims />} />
        <Route path="links" element={<Links />} />
        <Route path="partners" element={<Partners />} />
        <Route path="contacts" element={<Aims />} />
        <Route path="workstructure" element={<WS />} />

        <Route
          path="search"
          element={
            <ProtectedRoute
              element={<Search />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="search-powerpoint" element={<SearchPowerPoint />} />
        <Route path="/view-pdf/:fileId/:fileKey" element={<ViewPdf />} />
        <Route path="view-ppt/:fileId/:file" element={<ViewPpt />} />
        <Route
          path="settings"
          element={
            <ProtectedRoute
              element={<Settings />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="auth"
          element={<AuthForm onPasswordSubmit={handlePasswordSubmit} />}
        />
        <Route
          path="auth-search"
          element={<AuthForm onPasswordSubmit={handleSearchPasswordSubmit} />}
        />
        <Route
          path="auth-settings"
          element={<AuthForm onPasswordSubmit={handleSettingsPasswordSubmit} />}
        />
        <Route
          path="Upload"
          element={
            <ProtectedRoute
              element={<Upload />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <Router>
    <Auth0ProviderWithHistory>
      <App />
    </Auth0ProviderWithHistory>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals.console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
