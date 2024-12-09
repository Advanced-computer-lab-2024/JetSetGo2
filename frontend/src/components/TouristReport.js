import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TouristReport = () => {
  const location = useLocation();
  const adverId = location.state?.adverId; // Access the adverId from state
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          `http://localhost:8000/activity/report/${adverId}`
        );
        setReportData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [adverId]);

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
