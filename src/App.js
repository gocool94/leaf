import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail";
import Header from "./Header";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader";
import AdminPanel from "./AdminPanel";
import EditorPanel from "./EditorPanel";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // Fetch allowed users from JSON
    fetch("/allowedUsers.json")
      .then((response) => response.json())
      .then((data) => setAllowedUsers(data))
      .catch((error) => console.error("Error loading user data:", error));
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");
    if (email) {
      const user = allowedUsers.find((user) => user.email === email);
      if (user) {
        setUserEmail(email);
        setUserName(name);
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin);
        setIsEditor(user.isEditor);
      }
    }
  }, [allowedUsers]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = allowedUsers.find(
      (user) => user.email === userEmail && user.password === password
    );
    if (user) {
      localStorage.setItem("user_email", userEmail);
      localStorage.setItem("user_name", userName);
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin);
      setIsEditor(user.isEditor);
      setLoginError("");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleEmailChange = (e) => setUserEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Header userName={userName} />}
        <div className="app-container">
          {isAuthenticated ? (
            <Routes>
              <Route path="/" element={<TopicsList />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/upload" element={<FileUploader />} />
              <Route path="/:industry" element={<RetailBankingDetail />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
              {isEditor && <Route path="/editor" element={<EditorPanel />} />}
              {!isAdmin && <Route path="/admin" element={<Navigate to="/" />} />}
              {!isEditor && <Route path="/editor" element={<Navigate to="/" />} />}
            </Routes>
          ) : (
            <div className="login-page">
              <div className="login-box">
                <h2 className="typing-effect">Sign in - LEAF Initiative</h2>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={handleEmailChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  {loginError && <p className="error-message">{loginError}</p>}
                  <button type="submit" className="login-button">
                    Login
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
