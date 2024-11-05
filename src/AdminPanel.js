import React, { useState, useEffect } from "react";
import UserModal from "./UserModal"; // Make sure this path is correct
import AnalyticsSection from "./AnalyticsSection"; // Import the AnalyticsSection
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [activeSection, setActiveSection] = useState("userManagement"); // State to track active section

  // Fetch users from FastAPI backend
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error loading users:", error));
  }, []);

  const handleAddUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setShowAddUserModal(false);

    // Update the users on the backend
    fetch("http://localhost:8000/updateUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUsers),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => console.log("User list updated:", data))
      .catch((error) => console.error("Error updating users:", error));
  };

  const handleDeleteUser = (email) => {
    const updatedUsers = users.filter(user => user.email !== email);
    setUsers(updatedUsers);

    // Optionally send updated user list to backend
    fetch("http://localhost:8000/updateUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUsers),
    })
      .then(response => response.json())
      .then(data => console.log("User list updated:", data))
      .catch(error => console.error("Error updating users:", error));
  };

  // Filtering users
  const generalUsers = users.filter((user) => !user.isAdmin && !user.isEditor);
  const editors = users.filter((user) => user.isEditor && !user.isAdmin);
  const admins = users.filter((user) => user.isAdmin);

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="button-group">
        <button 
          className="button add-user-button" 
          onClick={() => setActiveSection("userManagement")}
        >
          User Management
        </button>
        <button 
          className="button analytics-button" 
          onClick={() => setActiveSection("analytics")}
        >
          Analytics
        </button>
        <button className="button">Other Options</button>
        <button className="button">Settings</button>
      </div>

      {/* Render Active Section */}
      {activeSection === "userManagement" && (
        <div className="section-container">
          <button 
            className="button add-user-button" 
            onClick={() => setShowAddUserModal(true)} // Open modal
          >
            Add User
          </button>
          <div className="user-section">
            <h2>Admins</h2>
            <ul className="user-list">
              {admins.map((user, index) => (
                <li key={index} className="user-card admin-card">
                  {user.email}
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="user-section">
            <h2>Editors</h2>
            <ul className="user-list">
              {editors.map((user, index) => (
                <li key={index} className="user-card editor-card">
                  {user.email}
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="user-section">
            <h2>Users</h2>
            <ul className="user-list">
              {generalUsers.map((user, index) => (
                <li key={index} className="user-card user-card-general">
                  {user.email}
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.email)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          {/* User Modal for Adding New User */}
          <UserModal
            isOpen={showAddUserModal}
            onClose={() => setShowAddUserModal(false)}
            onAddUser={handleAddUser}
          />
        </div>
      )}

      {/* Render Analytics Section */}
      {activeSection === "analytics" && <AnalyticsSection />}
    </div>
  );
}

export default AdminPanel;
