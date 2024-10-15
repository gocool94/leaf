import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopicsList from "./TopicsList";
import RetailBankingDetail from "./RetailBankingDetail"; // Dynamic industry details
import Header from "./Header";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader"; // Import FileUploader component
import "./App.css";
import 'font-awesome/css/font-awesome.min.css';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-container">
          {isSidebarOpen && <Sidebar />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<TopicsList />} />
              <Route path="/search" element={<SearchResults />} />
              {/* Route for file upload */}
              <Route path="/upload" element={<FileUploader />} />
              {/* Dynamic route for any industry */}
              <Route path="/:industry" element={<RetailBankingDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
