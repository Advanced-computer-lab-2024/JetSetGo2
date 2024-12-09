import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TouristReport = () => {
  const location = useLocation();
  const adverId = location.state?.adverId; // Access the adverId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // Track selected month

  // Handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!adverId) {
        setError("Advertiser ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/activity/report/${adverId}`,
          {
            params: {
              month: selectedMonth, // Pass selected month as query param
            },
          }
        );
        setReportData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [adverId, selectedMonth]); // Refetch data when adverId or selectedMonth changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tourist Report</h1>

      <div>
        <label htmlFor="month">Select Month:</label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <p>Total Tourists: {reportData.totalTourists}</p>
      <h2>Activity Details</h2>
      <ul>
        {reportData.activityDetails.map((activity) => (
          <li key={activity.activityId}>
            <p>Activity ID: {activity.activityId}</p>
            <p>Location: {activity.location}</p>
            <p>Date: {activity.date}</p>
            <p>Bookings: {activity.bookings}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristReport;
