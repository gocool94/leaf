import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import kpiData from "./kpi_output.json"; // Import the JSON file
import { FaHome } from "react-icons/fa";
import "./RetailBankingDetail.css";

const RetailBanking = () => {
  const { industry } = useParams(); // Capture the dynamic industry from the URL
  const location = useLocation(); // Capture the state passed from search results
  const navigate = useNavigate(); // For navigation to detail pages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [sections, setSections] = useState([]); // State to hold the sections data
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Track the selected subcategory
  const [industryDefinition, setIndustryDefinition] = useState(""); // Track the industry definition

  // Normalize the industry parameter and filter the corresponding data from kpiData
  const normalizedIndustry = industry
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-");

  // Function to format industry name for display
  const formatIndustryTitle = (normalizedName) => {
    return normalizedName
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\band\b/g, "&"); // Optionally replace 'and' with '&'
  };

  useEffect(() => {
    const industryData = kpiData.flatMap((domainData) =>
      domainData.industries.filter((ind) => {
        const jsonIndustryName = ind.industry
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/&/g, "-");
        return jsonIndustryName === normalizedIndustry;
      })
    );

    if (industryData.length === 0) {
      setSections([]);
      setIndustryDefinition(""); // Clear the definition if no data found
      return;
    }

    const industryInfo = industryData[0];
    setIndustryDefinition(industryInfo.industry_definition); // Set the industry definition

    const newSections = industryInfo.classifications.map(
      (classification) => ({
        name: classification.classification,
        definition: classification.classification_definition, // Add classification definition
        categories: classification.departments.map((department) => ({
          name: department.department,
          definition: department.department_definition, // Add department definition
          topics: department.subdepartments.map((subdepartment) => ({
            name: subdepartment.subdepartment,
            definition: subdepartment.subdepartment_definition, // Add subdepartment definition
            kpis: subdepartment.kpicollection,
            useCases: subdepartment.usecases_classifications || [], // Updated for classifications
          })),
        })),
      })
    );

    setSections(newSections);

    // Check for passed KPI from the search results
    const passedKpi = location.state?.kpi || null;

    if (passedKpi) {
      const foundKpi = newSections
        .flatMap((section) =>
          section.categories.flatMap((category) =>
            category.topics.flatMap((topic) =>
              topic.kpis.find((kpiObj) => kpiObj.kpi === passedKpi)
            )
          )
        )
        .filter(Boolean)[0];

      if (foundKpi) {
        setModalContent({
          section: "KPI from search",
          category: "KPI category",
          topic: { kpis: [foundKpi], useCases: [] },
        });
        setIsModalOpen(true);
      }
    }
  }, [normalizedIndustry, location.state]); // Dependencies to rerun the effect

  const handleTopicClick = (section, category, topic) => {
    setModalContent({
      section,
      category,
      topic,
    });
    setSelectedSubcategory(topic.name); // Set selected subcategory
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubcategory(null); // Reset selected subcategory on modal close
  };

  const goToDetailPage = (topicName) => {
    const normalizedSubcategory = topicName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/detail/${normalizedIndustry}/${normalizedSubcategory}`);
  };

  return (
    <div className="retail-banking-page">
      <div className="header-container">
        <Link to="/" className="home-button">
          <FaHome />
        </Link>
        {/* Display the formatted title with a hover tooltip showing the industry definition */}
        <h1
          className="title"
          title={industryDefinition || "Industry description not available"}
        >
          {formatIndustryTitle(industry)}
        </h1>
      </div>

      <div className="content">
        {sections.length > 0 ? (
          sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="section">
              {/* Display tooltip for the classification */}
              <h2 title={section.definition || "Classification description not available"}>
                {section.name}
              </h2>
              <div className="categories">
                {section.categories.map((category, categoryIdx) => (
                  <div key={categoryIdx} className="category">
                    {/* Display tooltip for the department */}
                    <h3 title={category.definition || "Department description not available"}>
                      {category.name}
                    </h3>
                    <div className="topics">
                      {category.topics.map((topic, topicIdx) => (
                        <button
                          key={topicIdx}
                          className={`topic-button ${
                            selectedSubcategory === topic.name
                              ? "highlighted"
                              : ""
                          }`} // Apply a highlighted class if selected
                          onClick={() => {
                            console.log(`Clicked on topic: ${topic.name}`); // Debugging log
                            handleTopicClick(section.name, category.name, topic);
                          }}
                          title={topic.definition || "Subdepartment description not available"} // Tooltip for subdepartment
                        >
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No data available for {industry}.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          content={modalContent}
        >
          <button
            className="go-to-detail-button"
            onClick={() => goToDetailPage(modalContent.topic.name)}
          >
            Go to Detail Page
          </button>
        </Modal>
      )}
    </div>
  );
};

export default RetailBanking;
