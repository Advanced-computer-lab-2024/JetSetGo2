import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TouristReport = () => {
  const location = useLocation();
  const userId = location.state?.userId; // Retrieve tourGuideId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      if (!userId) {
        setError("Tour Guide ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/itinerary/report/${userId}`);
        setReportData(response.data); // Set the data to state
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]); // Ensure effect runs when tourGuideId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tourist Report</h1>

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
