import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// Service method to fetch activities
const getActivity = async () => {
  try {
    const response = await axios.get("http://localhost:8000/activity/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching Activities:", error);
    throw error;
  }
};

// Service method to flag an activity
const flagActivity = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/activity/flag/${id}`);
  } catch (error) {
    console.error("Error flagging activity:", error);
  }
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchActivities = async () => {
    try {
      const response = await getActivity();
      setActivities(response); // Store both flagged and unflagged activities
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to load activities.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle flagging an activity
  const handleFlagActivity = async (id) => {
    await flagActivity(id);
    fetchActivities(); // Refresh list after flagging
  };

  return (
    <div id="activities">
      <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      <h2 className="title">Available Activities</h2>

      {error && <p className="error">{error}</p>}

      {activities.length > 0 ? (
  <ul className="activity-list">
    {activities.map((activity) => {
      // Extract latitude and longitude from the activity location
      const locationCoords = activity.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <li key={activity._id} className="activity-item">
          <iframe
            src={mapSrc}
            width="250"
            height="200"
            style={{ border: 'none' }}
            title={`Map of ${activity.location}`}
          ></iframe>
          <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {activity.time}</p>
          <p><strong>Price:</strong> ${activity.price}</p>
          <p><strong>Category:</strong> {activity.category?.name || "N/A"}</p>
          <p><strong>Tags:</strong> {activity.tags?.name || "N/A"}</p>
          <p><strong>Rating:</strong> {activity.rating}</p>
          <p><strong>Flagged:</strong> {activity.flagged ? "Yes" : "No"}</p>

          {/* Flag button */}
          <button
            className="flag-button"
            onClick={() => handleFlagActivity(activity._id)}
            disabled={activity.flagged} // Disable button if already flagged
          >
            {activity.flagged ? "Unavailable" : "Flag as Unavailable"}
          </button>
        </li>
      );
    })}
  </ul>
) : (
  <p>No Activities available.</p>
)}

    </div>
  );
};

export default Activities;