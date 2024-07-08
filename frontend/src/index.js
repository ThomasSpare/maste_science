import React from "react";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayOut />}>
          <Route index element={<Home />} />
          <Route path="/Search" index element={<Search />} />
          <Route path="/Upload" index element={<Upload />} />
          <Route path="/view-pdf/:fileId/:file" element={<ViewPdf />} />
          <Route path="/auth" index element={<ModalAuth />} />
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
