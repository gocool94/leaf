// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail"; // Dynamic industry details
import Header from "./Header";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader"; // Import FileUploader component
import GoogleSignIn from "./GoogleSignIn"; // Import the Google Sign-In component
import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import "./App.css";
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE"> {/* Your Google Client ID */}
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <div className="app-container">
              {isSidebarOpen && <Sidebar />}
              <div className="main-content">
                <Routes>
                  <Route path="/" element={<GoogleSignIn />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/upload" element={<FileUploader />} />
                  <Route path="/:industry" element={<RetailBankingDetail />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
