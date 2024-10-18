import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import headerImage from "./header.png"; // Adjust the path as needed
import kpiData from "./kpi_output.json"; // Import the JSON file

const Header = ({ userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // Ref for sidebar
  const toggleButtonRef = useRef(null); // Ref for toggle button

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filteredSuggestions = getSuggestions(query);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestions = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const results = [];

    kpiData.forEach((domain) => {
      domain.industries.forEach((industry) => {
        if (industry.industry.toLowerCase().includes(lowercasedQuery)) {
          results.push(industry.industry);
        }
        industry.classifications.forEach((classification) => {
          classification.departments.forEach((department) => {
            if (department.department.toLowerCase().includes(lowercasedQuery)) {
              results.push(department.department);
            }
            department.subdepartments.forEach((subdepartment) => {
              if (
                subdepartment.subdepartment
                  .toLowerCase()
                  .includes(lowercasedQuery)
              ) {
                results.push(subdepartment.subdepartment);
              }
              subdepartment.kpicollection.forEach((kpi) => {
                if (kpi.kpi.toLowerCase().includes(lowercasedQuery)) {
                  results.push(kpi.kpi);
                }
              });
            });
          });
        });
      });
    });

    return [...new Set(results)];
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_email"); // Remove user email from localStorage
    localStorage.removeItem("user_name"); // Remove user name from localStorage
    navigate("/"); // Navigate to the login page or home page
    window.location.reload(); // Optionally, refresh the page to ensure the logout state
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const aggregateData = (data) => {
    const aggregated = {};

    data.forEach((entry) => {
      if (!aggregated[entry.domain]) {
        aggregated[entry.domain] = { industries: [] };
      }
      aggregated[entry.domain].industries.push(...entry.industries);
    });

    return Object.entries(aggregated).map(([domain, { industries }]) => ({
      domain,
      industries,
    }));
  };

  const categories = aggregateData(kpiData);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, toggleButtonRef]);

  return (
    <header className="header">
      <div
        className="snowflake-icon"
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen}
        ref={toggleButtonRef} // Attach ref to toggle button
      >
        ❄️
      </div>
      <div className="header-image-container">
        <img src={headerImage} alt="Header" className="header-image" />
      </div>
      <div className="search-container relative">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User Info Section */}
      <div className="user-info">
        <div className="user-email">{localStorage.getItem("user_email")}</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <nav
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <button
          className="close-btn"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          ×
        </button>
        <div className="sidebar-content">
          {categories.map((category) => (
            <div key={category.domain} className="category-box">
              <h2 className="category-heading">{category.domain}</h2>
              <div className="domain-box">
                <ul className="subcategory-list">
                  {category.industries.map((subcategory, index) => (
                    <li key={index} className="subcategory-item">
                      <Link
                        to={`/${subcategory.industry
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <button className="subcategory-button">
                          {subcategory.industry}
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
