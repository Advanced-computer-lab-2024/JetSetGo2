import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TouristReport = () => {
  const location = useLocation();
  const userId = location.state?.userId; // Retrieve tourGuideId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(""); // Track selected month

  // Handle month selection
  const handleMonthChange = async (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchReport = async () => {
      if (!userId) {
        setError("Tour Guide ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/itinerary/report/${userId}`, {
          params: {
            month: selectedMonth, // Pass selected month as query param
          },
        });
        setReportData(response.data); // Set the data to state
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, selectedMonth]); // Fetch the report whenever userId or selectedMonth changes

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
      <h2>Itinerary Details</h2>
      <ul>
        {reportData.itineraryDetails.map((itinerary) => (
          <li key={itinerary.itineraryId}>
            <p>Itinerary ID: {itinerary.itineraryId}</p>
            <p>Name: {itinerary.name}</p>
            <p>Total Bookings: {itinerary.totalBookings}</p>
            <p>Bookings: {itinerary.bookings}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristReport;
