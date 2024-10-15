import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS

const Modal = ({ isOpen, onClose, content }) => {
  const [activeTab, setActiveTab] = useState("Use Cases");
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  // KPIs and Use Cases associated with the topic passed from the parent component
  const kpiOptions = content?.topic?.kpis || [];
  const classificationOptions = content?.topic?.useCases || []; // Ensure classifications are included

  // Set default selection when the modal opens or when the active tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === "Use Cases" && classificationOptions.length > 0) {
        setSelectedClassification(classificationOptions[0]);
        setSelectedUseCase(null); // Reset use case when classification changes
      } else if (activeTab === "KPI's" && kpiOptions.length > 0) {
        setSelectedUseCase(kpiOptions[0]);
      }
    }
  }, [isOpen, activeTab, kpiOptions, classificationOptions]);

  // Function to handle clicking outside the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !content) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 md:p-8 rounded-lg w-full max-w-lg md:max-w-6xl h-auto overflow-hidden">
        {/* Modal Header */}
        <h2 className="text-2xl font-bold mb-4">
          {content.section} - {content.topic.name}
        </h2>

        {/* Tabs for switching between KPI's and Use Cases */}
        <div className="flex mb-4">
          <button
            className={`flex-1 px-3 py-2 mx-2 rounded ${
              activeTab === "KPI's" ? "bg-green-500 text-white" : "bg-gray-300"
            } text-sm transition`}
            onClick={() => setActiveTab("KPI's")}
          >
            KPI's
          </button>
          <button
            className={`flex-1 px-3 py-2 mx-2 rounded ${
              activeTab === "Use Cases" ? "bg-green-500 text-white" : "bg-gray-300"
            } text-sm transition`}
            onClick={() => setActiveTab("Use Cases")}
          >
            Use Cases
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto mb-4">
          {/* Render KPI or Use Case options */}
          {activeTab === "Use Cases" ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {classificationOptions.map((classification, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 rounded ${
                      selectedClassification === classification
                        ? "bg-green-500 text-white"
                        : "bg-gray-300"
                    } text-sm transition`}
                    onClick={() => {
                      setSelectedClassification(classification);
                      setSelectedUseCase(null); // Reset selected use case when classification changes
                    }}
                  >
                    {classification.classification}
                  </button>
                ))}
              </div>

              {/* Render Use Cases for Selected Classification */}
              {selectedClassification && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedClassification.usecases_collection.map((useCase, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 rounded ${
                        selectedUseCase === useCase
                          ? "bg-green-500 text-white"
                          : "bg-gray-300"
                      } text-sm transition`}
                      onClick={() => setSelectedUseCase(useCase)}
                    >
                      {useCase.definition}
                    </button>
                  ))}
                </div>
              )}

              {/* Display selected Use Case details */}
              {selectedUseCase && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedUseCase.definition}
                  </h3>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedUseCase.description || "No description available."}
                  </p>
                  <p>
                    <strong>Business Impact:</strong>{" "}
                    {selectedUseCase.business_impact || "No business impact available."}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {kpiOptions.map((kpi, idx) => (
                <button
                  key={idx}
                  className={`px-4 py-2 rounded ${
                    selectedUseCase === kpi ? "bg-green-500 text-white" : "bg-gray-300"
                  } text-sm transition`}
                  onClick={() => setSelectedUseCase(kpi)}
                >
                  {kpi.kpi}
                </button>
              ))}
            </div>
          )}

          {/* Display selected KPI details */}
          {selectedUseCase && activeTab === "KPI's" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">{selectedUseCase.kpi}</h3>
              <p>
                <strong>Explanation:</strong>{" "}
                {selectedUseCase.explanation || "No explanation available."}
              </p>
              <p>
                <strong>Formula:</strong>{" "}
                {selectedUseCase.formula || "No formula available."}
              </p>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded float-right"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
