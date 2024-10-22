import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail";
import Header from "./Header";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";

// List of allowed email IDs with their passwords
const allowedUsers = [
  { email: "gocool94@gmail.com", password: "kipi123" },
  { email: "gokul.k.v@kipi.ai", password: "kipi123" },
  { email: "jason.small@kipi.bi", password: "kipi123" },
  { email: "venkata.n.tata@kipi.ai", password: "kipi123" },
  { email: "pradyut.k.mitra@kipi.ai", password: "kipi123" },
  { email: "aman.j.mishra@kipi.ai", password: "kipi123" },
  { email: "swati.a.dey@kipi.ai", password: "kipi123" },
  { email: "priyata.p.solanki@kipi.ai", password: "kipi123" },
  { email: "sharon.v.victor@kipi.ai", password: "kipi123" },
  { email: "priyanka.s.kotikalapudi@kipi.ai", password: "kipi123" },
  { email: "balaji.s.sundararajan@kipi.ai", password: "kipi123" },
  { email: "shashank.c.mauli@kipi.ai", password: "kipi123" },
  { email: "harivamsi.p.pullipudi@kipi.ai", password: "kipi123" },
  { email: "rakesh@kipi.ai", password: "kipiaipwd" },
  { email: "babu@kipi.bi", password: "pwdkipiai" },
  { email: "babu@kipi.ai", password: "pwdkipiai" },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState(""); // State for the user's name
  const [password, setPassword] = useState(""); // State for the password
  const [loginError, setLoginError] = useState(""); // State for login error messages

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name"); // Get the name from localStorage
    if (email && allowedUsers.find((user) => user.email === email)) {
      setUserEmail(email);
      setUserName(name); // Set the user's name
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    const user = allowedUsers.find(
      (user) => user.email === userEmail && user.password === password
    );
    if (user) {
      localStorage.setItem("user_email", userEmail); // Store email in localStorage
      localStorage.setItem("user_name", userName); // Store name in localStorage
      setIsAuthenticated(true);
      setLoginError(""); // Clear any previous errors
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
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
