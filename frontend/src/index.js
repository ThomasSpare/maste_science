import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <Router>
        <Routes>
          <Route path="/" element={<LayOut />}>
            <Route index element={<Home />} />
            <Route path="What_is_Maste" element={<WhatIs />} />
            <Route path="Aims" element={<Aims />} />
            <Route path="links" element={<Links />} />
            <Route path="partners" element={<Partners />} />
            <Route path="contacts" element={<Aims />} />

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
