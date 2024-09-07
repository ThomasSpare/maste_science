import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import ReactDOM from "react-dom";
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
import AuthProvider from "./Auth/AuthProvider";
import ProtectedRoute from "./Auth/ProtectedRoute";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <AuthProvider>
        <LayOut>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search-powerpoint" element={<SearchPowerPoint />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/view-pdf/:fileId/:file" element={<ViewPdf />} />
            <Route path="/view-ppt/:fileId/:file" element={<ViewPpt />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/auth"
              element={
                <ModalAuth
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <ProtectedRoute path="/dashboard" component={Settings} />
          </Routes>
        </LayOut>
      </AuthProvider>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals.console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
