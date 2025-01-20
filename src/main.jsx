import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Toaster />
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
