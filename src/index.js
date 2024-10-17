// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace with your Google Client ID

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="503155085709-6s7ip7t1950g3494ra9u5llq5q8jkg9d.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
