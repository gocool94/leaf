import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [logs, setLogs] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLogs((prevLogs) => [...prevLogs, `File selected: ${file.name}`]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Log the upload start
      setLogs((prevLogs) => [...prevLogs, "Uploading file..."]);

      // Make a request to upload the file to the FastAPI backend
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Log the complete response for debugging
      console.log("Response:", response);

      if (response.data.success) {
        setLogs((prevLogs) => [...prevLogs, "File uploaded successfully! Processing..."]);
        setLogs((prevLogs) => [...prevLogs, `File saved at: ${response.data.file_path}`]);
        // Append logs from the server to the logs state
        setLogs((prevLogs) => [...prevLogs, ...response.data.logs]);
      } else {
        setLogs((prevLogs) => [...prevLogs, `Error uploading the file: ${response.data.error}`]);
        // Append logs from the server to the logs state
        setLogs((prevLogs) => [...prevLogs, ...response.data.logs]);
      }
    } catch (error) {
      console.error("Error:", error);
      setLogs((prevLogs) => [...prevLogs, `Error uploading file: ${error.message}`]);
      // Handle more specific errors if available
      if (error.response) {
        console.error("Response error:", error.response);
        setLogs((prevLogs) => [...prevLogs, `Server responded with error: ${error.response.data.error}`]);
        // Append logs from the server to the logs state
        setLogs((prevLogs) => [...prevLogs, ...error.response.data.logs]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Upload and Process File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
      />
      <button
        onClick={handleFileUpload}
        className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 mb-4"
      >
        Upload and Process
      </button>
      <div className="mt-4 w-full max-w-2xl">
        <h3 className="text-lg font-semibold">Logs:</h3>
        <pre className="bg-gray-200 p-4 rounded-lg h-96 overflow-y-auto w-full">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default FileUploader;
