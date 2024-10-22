import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./kpi_output.json"; // Adjust the path to your JSON file

const SearchResults = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [expandedIndustry, setExpandedIndustry] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const results = [];

      // Search logic to find KPIs and use cases based on the search query
      data.forEach((domain) => {
        if (domain.industries && Array.isArray(domain.industries)) {
          domain.industries.forEach((industry) => {
            const matchedKPIs = [];
            const matchedUseCases = [];

            if (
              industry.classifications &&
              Array.isArray(industry.classifications)
            ) {
              industry.classifications.forEach((classification) => {
                if (
                  classification.departments &&
                  Array.isArray(classification.departments)
                ) {
                  classification.departments.forEach((department) => {
                    if (
                      department.subdepartments &&
                      Array.isArray(department.subdepartments)
                    ) {
                      department.subdepartments.forEach((subdepartment) => {
                        // Check for matching KPIs
                        if (
                          subdepartment.kpicollection &&
                          Array.isArray(subdepartment.kpicollection)
                        ) {
                          subdepartment.kpicollection.forEach((kpi) => {
                            if (
                              kpi.kpi &&
                              kpi.kpi
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            ) {
                              matchedKPIs.push({
                                ...kpi,
                                subdepartment: subdepartment.subdepartment,
                                department: department.department,
                                classification: classification.classification,
                              });
                            }
                          });
                        }

                        // Check for matching use cases
                        if (
                          subdepartment.usecases_classifications &&
                          Array.isArray(subdepartment.usecases_classifications)
                        ) {
                          subdepartment.usecases_classifications.forEach(
                            (usecaseClass) => {
                              if (
                                usecaseClass.usecases_collection &&
                                Array.isArray(usecaseClass.usecases_collection)
                              ) {
                                usecaseClass.usecases_collection.forEach(
                                  (usecaseObj) => {
                                    if (
                                      usecaseObj.name &&
                                      usecaseObj.name
                                        .toLowerCase()
                                        .includes(searchQuery.toLowerCase())
                                    ) {
                                      matchedUseCases.push({
                                        ...usecaseObj,
                                        subdepartment:
                                          subdepartment.subdepartment,
                                        department: department.department,
                                        classification:
                                          usecaseClass.classification,
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      });
                    }
                  });
                }
              });
            }

            // Only push industries with matched KPIs or use cases
            if (matchedKPIs.length > 0 || matchedUseCases.length > 0) {
              results.push({
                industry: industry.industry,
                departments: industry.classifications.flatMap(
                  (classification) =>
                    classification.departments.map((dept) => ({
                      department: dept.department,
                      subdepartments: dept.subdepartments,
                      matchedKPIs,
                      matchedUseCases,
                    }))
                ),
              });
            }
          });
        }
      });

      // Filter out industries without matching KPIs or Use Cases
      const filteredResults = results.filter((industry) => {
        const hasMatchingKPIs = industry.departments.some(
          (dept) => dept.matchedKPIs.length > 0
        );
        const hasMatchingUseCases = industry.departments.some(
          (dept) => dept.matchedUseCases.length > 0
        );
        return hasMatchingKPIs || hasMatchingUseCases;
      });

      setFilteredResults(filteredResults);
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  const handleIndustryClick = (index) => {
    setExpandedIndustry(index === expandedIndustry ? null : index);
    setExpandedDepartment({});
  };

  const handleDepartmentClick = (industryIndex, departmentName) => {
    setExpandedDepartment((prevState) => ({
      ...prevState,
      [industryIndex]:
        prevState[industryIndex] === departmentName ? null : departmentName,
    }));
  };

  const goBackHome = () => {
    navigate("/");
  };

  const handleItemClick = (item, industry) => {
    setSelectedItem(item);
    setSelectedIndustry(industry);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const goToDetailPage = () => {
    const mainTopic = selectedIndustry.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${mainTopic}`, {
      state: {
        selectedItem,
        subdepartment: selectedItem.subdepartment || null,
      },
    });
  };

  return (
    <div className="search-results-page py-6 px-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={goBackHome}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
        >
          Back to Home
        </button>
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Search Results
      </h2>
      <div className="text-lg text-gray-600 mb-4">
        Results for{" "}
        <span className="font-bold text-blue-600">"{searchQuery}"</span>:
      </div>

      <div className="results-container">
        {filteredResults.length > 0 ? (
          filteredResults.map((industry, industryIndex) => (
            <div key={industryIndex} className="industry-box mb-4">
              <div
                className="industry-title cursor-pointer flex justify-between items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-2 rounded-lg shadow-md"
                onClick={() => handleIndustryClick(industryIndex)}
              >
                <div className="flex items-center">
                  <div className="icon-box bg-white text-teal-500 rounded-full p-2 mr-2">
                    <i className="fas fa-industry"></i>
                  </div>
                  <span className="text-lg">{industry.industry}</span>
                </div>
                <span className="ml-2">
                  {expandedIndustry === industryIndex ? "−" : "+"}
                </span>
              </div>

              {expandedIndustry === industryIndex && (
                <div className="pl-4 mt-2 border border-gray-300 p-4 rounded-lg">
                  {/* Department Buttons in Row-wise Layout */}
                  <div className="flex flex-wrap gap-4">
                    {industry.departments.map((department, deptIndex) => (
                      <div key={deptIndex} className="department-box">
                        <button
                          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                          onClick={() =>
                            handleDepartmentClick(
                              industryIndex,
                              department.department
                            )
                          }
                        >
                          {department.department}
                        </button>

                        {/* Expand Subdepartments */}
                        {expandedDepartment[industryIndex] ===
                          department.department && (
                          <div className="pl-4 mt-2">
                            {department.subdepartments.map(
                              (subdepartment, subIdx) => {
                                return (
                                  <div
                                    key={subIdx}
                                    className="subdepartment-box mb-2 border border-green-300 p-2 rounded-md"
                                  >
                                    <h5 className="text-lg font-semibold text-green-700 mb-2">
                                      Subdepartment:{" "}
                                      {subdepartment.subdepartment}
                                    </h5>

                                    {/* KPIs Row Layout */}
                                    <h6 className="text-md font-semibold text-green-600 mb-1">
                                      KPIs:
                                    </h6>
                                    <div className="flex flex-wrap gap-2">
                                      {department.matchedKPIs.map(
                                        (kpi, kpiIdx) => (
                                          <button
                                            key={kpiIdx}
                                            className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 shadow-sm"
                                            onClick={() =>
                                              handleItemClick(
                                                kpi,
                                                industry.industry
                                              )
                                            }
                                          >
                                            {kpi.kpi}
                                          </button>
                                        )
                                      )}
                                    </div>

                                    {/* Use Cases Row Layout */}
                                    {department.matchedUseCases.length > 0 && (
                                      <>
                                        <h6 className="text-md font-semibold text-blue-600 mb-1 mt-2">
                                          Use Cases:
                                        </h6>
                                        <div className="flex flex-wrap gap-2">
                                          {department.matchedUseCases.map(
                                            (useCase, ucIdx) => (
                                              <button
                                                key={ucIdx}
                                                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 shadow-sm"
                                                onClick={() =>
                                                  handleItemClick(
                                                    useCase,
                                                    industry.industry
                                                  )
                                                }
                                              >
                                                {useCase.name}
                                              </button>
                                            )
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No matching results found.</div>
        )}
      </div>

      {/* Modal for displaying selected KPI or Use Case */}
      {selectedItem && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white rounded-lg p-6 w-[600px] shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Details</h3>

            {/* Check if selected item has KPI information */}
            {selectedItem.kpi && (
              <>
                <div className="mb-2">
                  <strong>KPI:</strong> {selectedItem.kpi}
                </div>
                <div className="mb-2">
                  <strong>Explanation:</strong>{" "}
                  {selectedItem.explanation || "N/A"}
                </div>
                <div className="mb-2">
                  <strong>Formula:</strong> {selectedItem.formula || "N/A"}
                </div>
              </>
            )}

            {/* If the selected item is a Use Case, display its information */}
            {selectedItem.name && (
              <>
                <div className="mb-2">
                  <strong>Definition:</strong> {selectedItem.definition}
                </div>
                <div className="mb-2">
                  <strong>Description:</strong> {selectedItem.description}
                </div>
                <div className="mb-2">
                  <strong>Business Impact:</strong>{" "}
                  {selectedItem.business_impact}
                </div>
              </>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 rounded-md px-4 py-2"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
                onClick={goToDetailPage}
              >
                Go to Detail Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
