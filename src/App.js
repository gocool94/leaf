import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail";
import Header from "./Header";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";

// List of allowed email IDs
const allowedEmails = [
  "gocool94@gmail.com",
  "gokul.k.v@kipi.ai",
  "jason.small@kipi.bi",
  "venkata.n.tata@kipi.ai",
  "pradyut.k.mitra@kipi.ai",
  "aman.j.mishra@kipi.ai",
  "swati.a.dey@kipi.ai",
  "priyata.p.solanki@kipi.ai",
  "sharon.v.victor@kipi.ai",
  "priyanka.s.kotikalapudi@kipi.ai",
  "balaji.s.sundararajan@kipi.ai",
  "shashank.c.mauli@kipi.ai",
  "harivamsi.p.pullipudi@kipi.ai",
  "addanotheremailhere",
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState(""); // New state for the user's name

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name"); // Get the name from localStorage
    if (email && allowedEmails.includes(email)) {
      setUserEmail(email);
      setUserName(name); // Set the user's name
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Google Sign-In success
  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential; // Get the JWT token from the response
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload part of the token

    const email = payload.email; // Extract the email from the token's payload
    const name = payload.name; // Extract the name from the token's payload

    if (allowedEmails.includes(email)) {
      localStorage.setItem("user_email", email); // Store email in localStorage
      localStorage.setItem("user_name", name); // Store name in localStorage
      setUserEmail(email);
      setUserName(name); // Set the name
      setIsAuthenticated(true);
    } else {
      alert("Unauthorized email");
    }
  };

  // Handle Google Sign-In failure
  const handleLoginFailure = () => {
    alert("Login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="503155085709-6s7ip7t1950g3494ra9u5llq5q8jkg9d.apps.googleusercontent.com">
      <Router>
        <div className="app">
          {isAuthenticated && <Header userName={userName} />}{" "}
          {/* Pass userName to Header */}
          <div className="app-container">
            {isAuthenticated ? (
              <Routes>
                <Route path="/" element={<TopicsList />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/upload" element={<FileUploader />} />
                <Route path="/:industry" element={<RetailBankingDetail />} />
              </Routes>
            ) : (
              <div className="login-page">
                <div className="login-box">
                  <h2>Welcome, please sign in</h2>
                  <p>Sign in with your Google account to proceed</p>
                  <div className="google-login-button">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginFailure}
                      useOneTap
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
