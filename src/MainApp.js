// MainApp.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TopicsList from "./TopicsList";
import SearchResults from "./SearchResults";
import FileUploader from "./FileUploader";
import RetailBankingDetail from "./RetailBankingDetail"; // Dynamic industry details

const MainApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        {isSidebarOpen && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/app" element={<TopicsList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/upload" element={<FileUploader />} />
            <Route path="/:industry" element={<RetailBankingDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
