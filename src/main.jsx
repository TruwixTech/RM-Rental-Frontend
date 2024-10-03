import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <App />
  </BrowserRouter>
);
