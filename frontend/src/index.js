import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LayOut from "./components/LayOut";
import Aims from "./pages/Aims";
import Links from "./pages/Links";
import Partners from "./pages/Partners";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import ViewPdf from "./pages/ViewPdf";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import SearchPowerPoint from "./pages/SearchPowerPoint";
import WhatIs from "./pages/WhatIs";
import Settings from "./pages/Settings";
import ViewPpt from "./pages/ViewPpt";
import WS from "./pages/WorkStructure";
import PublicDocs from "./pages/PublicDocs";

import Auth0ProviderWithHistory from "./Auth/Auth0Provider";
import DeliverabelsPublic from "./pages/DeliverablesPublic";
import Deliverabels from "./pages/Deliverables";
import Contacts from "./pages/Contacts";

import SelectedNews from "./pages/SelectedNews";
import ViewText from "./pages/ViewText";
import ContactList from "./pages/ContactLists";
import Meetings from "./pages/Meetings";
import ViewImg from "./pages/ViewImg";
import Promotion from "./pages/Promotion";
import Publication from "./pages/Publications";
import Report from "./pages/Report";
import WP1 from "./pages/WP/WP1";
import WP2 from "./pages/WP/WP2";
import WP3 from "./pages/WP/WP3";
import WP4 from "./pages/WP/WP4";
import WP5 from "./pages/WP/Wp5";
import WP6 from "./pages/WP/WP6";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<LayOut />}>
        <Route index element={<Home />} />
        <Route path="What_is_Maste" element={<WhatIs />} />
        <Route path="Aims" element={<Aims />} />
        <Route path="links" element={<Links />} />
        <Route path="partners" element={<Partners />} />
        <Route path="workstructure" element={<WS />} />
        <Route path="public_docs" element={<PublicDocs />} />
        <Route path="search" element={<Search />} />
        <Route path="promotion" element={<Promotion />} />
        <Route path="templates" element={<SearchPowerPoint />} />
        <Route path="/view-pdf/:fileId/:fileKey" element={<ViewPdf />} />
        <Route path="/view-ppt/:fileId/:fileKey" element={<ViewPpt />} />
        <Route path="view-ppt/:fileId/:file" element={<ViewPpt />} />
        <Route path="/view-text/:fileId/:fileKey" element={<ViewText />} />
        <Route path="/view-img/:fileId/:fileKey" element={<ViewImg />} />
        <Route path="publications" element={<Publication />} />
        <Route path="deliverables_public" element={<DeliverabelsPublic />} />
        <Route path="deliverables" element={<Deliverabels />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="/news/:id" element={<SelectedNews />} />
        <Route path="contactlists" element={<ContactList />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="reports" element={<Report />} />
        <Route path="WP1" element={<WP1 />} />
        <Route path="WP2" element={<WP2 />} />
        <Route path="WP3" element={<WP3 />} />
        <Route path="WP4" element={<WP4 />} />
        <Route path="WP5" element={<WP5 />} />
        <Route path="WP6" element={<WP6 />} />

        <Route path="settings" element={<Settings />} />
        <Route path="Upload" element={<Upload />} />
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
