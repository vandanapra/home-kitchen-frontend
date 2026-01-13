import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // 🔴 THIS IS VERY IMPORTANT
import { Toaster } from "react-hot-toast";

<Toaster position="top-right" />

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
