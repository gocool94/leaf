import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"; // For the user count chart
import Calendar from "react-calendar"; // For the calendar
import './AnalyticsSection.css'; // Make sure to create a CSS file for styling

const AnalyticsSection = () => {
  const [userData, setUserData] = useState([]);
  const [mostSearchedWords, setMostSearchedWords] = useState([]);

  // Sample user data for the chart (this would normally be fetched from your backend)
  useEffect(() => {
    const sampleUserData = [
      { date: "2024-11-01", users: 100 },
      { date: "2024-11-02", users: 150 },
      { date: "2024-11-03", users: 200 },
      { date: "2024-11-04", users: 250 },
      { date: "2024-11-05", users: 300 },
    ];
    setUserData(sampleUserData);

    // Sample most searched words data (this would also normally be fetched)
    const searchedWords = [
      { word: "React", count: 150 },
      { word: "JavaScript", count: 120 },
      { word: "CSS", count: 90 },
      { word: "HTML", count: 80 },
      { word: "Node.js", count: 60 },
    ];
    setMostSearchedWords(searchedWords);
  }, []);

  return (
    <div className="analytics-section">
      <h2>Analytics Overview</h2>

      {/* User Count Day-wise Chart */}
      <h3>User Count (Day-wise)</h3>
      <LineChart width={600} height={300} data={userData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="users" stroke="#8884d8" />
      </LineChart>

      {/* Calendar for Today's Date */}
      <h3>Today's Date</h3>
      <Calendar 
        value={new Date()} 
        tileContent={({ date }) => date.toDateString() === new Date().toDateString() ? <p>Today</p> : null}
      />

      {/* Most Searched Words Ranking */}
      <h3>Most Searched Words</h3>
      <ol>
        {mostSearchedWords.map((word, index) => (
          <li key={index}>
            {word.word} - {word.count} searches
          </li>
        ))}
      </ol>
      
      {/* Placeholder for Other Metrics */}
      <h3>Other Metrics</h3>
      <p>Additional metrics can be displayed here...</p>
    </div>
  );
};

export default AnalyticsSection;
