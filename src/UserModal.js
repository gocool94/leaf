// UserModal.js
import React, { useState } from "react";
import "./UserModal.css"; // Ensure your CSS styles are defined here

const UserModal = ({ isOpen, onClose, onAddUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Add password state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onAddUser) {
      onAddUser({ email, password, isAdmin, isEditor }); // Pass password to onAddUser
      setEmail("");
      setPassword(""); // Reset password field
      setIsAdmin(false);
      setIsEditor(false);
      onClose(); // Close modal after adding user
    } else {
      console.error("onAddUser is not a function");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password" // Password input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Admin
          </label>
          <label>
            <input
              type="checkbox"
              checked={isEditor}
              onChange={(e) => setIsEditor(e.target.checked)}
            />
            Editor
          </label>
          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Add User</button>
            <button type="button" className="close-btn" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
