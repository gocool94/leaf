import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./kpi_output.json"; // Adjust the path to your JSON file

const SearchResults = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const results = [];

      // Search logic
      data.forEach((domain) => {
        domain.industries.forEach((industry) => {
          const matchedDepartments = [];
          industry.classifications.forEach((classification) => {
            classification.departments.forEach((department) => {
              department.subdepartments.forEach((subdepartment) => {
                // Combining subdepartment and kpi for the search query
                subdepartment.kpicollection.forEach((kpi) => {
                  const combinedTitle = `${subdepartment.subdepartment}: ${kpi.kpi}`;
                  if (
                    combinedTitle
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  ) {
                    matchedDepartments.push({
                      department: department.department,
                      subdepartment: subdepartment.subdepartment,
                      kpi,
                    });
                  }
                });
              });
            });
          });

          // If there are matched departments, add to results
          if (matchedDepartments.length > 0) {
            results.push({
              industry: industry.industry,
              departments: matchedDepartments,
            });
          }
        });
      });

      // Update filtered results
      setFilteredResults(results);
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  const handleCategoryClick = (index) => {
    // Toggle the expansion of the category
    setExpandedCategory(index === expandedCategory ? null : index);
  };

  const handleSubcategoryClick = (index) => {
    // Toggle the expansion of the subcategory
    setExpandedSubcategory(index === expandedSubcategory ? null : index);
  };

  const goBackHome = () => {
    navigate("/");
  };

  return (
    <div className="search-results-page py-6 px-8 bg-gray-100 min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={goBackHome}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>

      {/* Search Results Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Results
      </h2>
      <div className="text-lg text-gray-600 mb-4">
        Results for "{searchQuery}":
      </div>

      {/* Results Container */}
      <div className="results-container">
        {filteredResults.length > 0 ? (
          filteredResults.map((category, index) => (
            <div key={index} className="category-box mb-4">
              {/* Category Title */}
              <div
                className="category-title cursor-pointer"
                onClick={() => handleCategoryClick(index)}
              >
                {category.industry}
                <span>{expandedCategory === index ? " - " : " + "}</span>
              </div>

              {/* Subcategories */}
              {expandedCategory === index && (
                <div className="subcategories pl-4">
                  {category.departments.map((dept, idx) => (
                    <div key={idx} className="subcat-container mb-2">
                      <button
                        className="subcat-button"
                        onClick={() => handleSubcategoryClick(idx)}
                      >
                        {dept.subdepartment}
                      </button>

                      {/* KPI and use case details on subcategory expand */}
                      {expandedSubcategory === idx && (
                        <div className="kpi-usecase pl-4">
                          <strong>KPI:</strong> {dept.kpi.kpi}
                          <br />
                          <strong>Formula:</strong> {dept.kpi.formula}
                          <br />
                          <strong>Explanation:</strong> {dept.kpi.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No results found for "{searchQuery}".
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
