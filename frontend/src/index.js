import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayOut from "./components/LayOut";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import ViewPdf from "./pages/ViewPdf";
import ModalAuth from "./components/modal_auth";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import SearchPowerPoint from "./pages/SearchPowerPoint";
import Settings from "./pages/Settings";
import ViewPpt from "./pages/ViewPpt";
import authConfig from "./Auth/auth_config.json";

import { Auth0Provider } from "@auth0/auth0-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      redirectUri={window.location.origin}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LayOut />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="search-powerpoint" element={<SearchPowerPoint />} />
            <Route path="upload" element={<Upload />} />
            <Route path="view-pdf/:fileId/:file" element={<ViewPdf />} />
            <Route path="view-ppt/:fileId/:file" element={<ViewPpt />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="auth"
              element={
                <ModalAuth
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </Auth0Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
