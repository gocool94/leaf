import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail";
import Header from "./Header"; // Import the Header component
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";

// List of allowed email IDs
const allowedEmails = [
  "gocool94@gmail.com",
  "gokul.k.v@kipi.bi",
  "dharanirocks94@gmail.com",
  "email4@example.com",
  "email5@example.com",
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if the user is authenticated from localStorage
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email && allowedEmails.includes(email)) {
      setUserEmail(email);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Google Sign-In success
  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential; // Get the JWT token from the response
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload part of the token

    const email = payload.email; // Extract the email from the token's payload
    if (allowedEmails.includes(email)) {
      localStorage.setItem("user_email", email); // Store email in localStorage
      setUserEmail(email);
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
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
      <Router>
        <div className="app">
          {isAuthenticated && <Header userEmail={userEmail} />}{" "}
          {/* Pass the userEmail to Header */}
          <div className="app-container">
            {isAuthenticated && isSidebarOpen && <Sidebar />}{" "}
            <div className="main-content">
              <Routes>
                {!isAuthenticated ? (
                  <Route
                    path="*"
                    element={
                      <div className="login-page">
                        <div className="login-box">
                          <h2>Welcome, please sign in</h2>
                          <p>Sign in with your Google account to proceed</p>
                          <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginFailure}
                            useOneTap
                            style={{ width: "100%" }} // Ensures button takes full width
                          />
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <>
                    <Route path="/" element={<TopicsList />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/upload" element={<FileUploader />} />
                    <Route
                      path="/:industry"
                      element={<RetailBankingDetail />}
                    />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
