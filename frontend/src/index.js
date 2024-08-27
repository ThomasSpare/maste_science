import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayOut from "./components/LayOut";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import ViewPdf from "./pages/ViewPdf";
import ModalAuth from "./components/modal_auth";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";
import SearchPowerPoint from "./pages/SearchPowerPoint";
import Settings from "./pages/Settings";
import ViewPpt from "./pages/ViewPpt";

Sentry.init({
  dsn: "https://2c54d8d1ddd169f0579e56fd4c45541b@o4507612471885824.ingest.de.sentry.io/4507612475555920",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "maste-science.onrender.com",
    /^https:\/\/yourserver\.io\/api/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route index element={<Home />} />
          <Route path="/Search" index element={<Search />} />
          <Route
            path="/Search-Powerpoint"
            index
            element={<SearchPowerPoint />}
          />
          <Route path="/Upload" index element={<Upload />} />
          <Route path="/view-pdf/:fileId/:file" element={<ViewPdf />} />
          <Route path="/view-ppt/:fileId/:file" element={<ViewPpt />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/auth"
            index
            element={
              <ModalAuth
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
