import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

// Service method to fetch itineraries
const getItineraries = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/itinerary/readTourId`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(""); // State for price sorting
  const [sortRating, setSortRating] = useState(""); // State for rating sorting
  const [Tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/itinerary/readTourId`
      );
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to load itineraries.");
    }
  };

  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/prefTags/readtag"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching Tags:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchTags();
    fetchActivities();
  }, []);

  // Function to handle sorting based on price
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    // Sort itineraries based on price
    let sortedItineraries = [...itineraries];
    if (value === "asc") {
      sortedItineraries.sort(
        (a, b) => Math.min(...a.TourPrice) - Math.min(...b.TourPrice)
      );
    } else if (value === "desc") {
      sortedItineraries.sort(
        (a, b) => Math.max(...b.TTourPrice) - Math.max(...a.TourPrice)
      );
    }
    setItineraries(sortedItineraries);
  };

  // Function to handle sorting based on rating
  const handleSortRatingChange = (e) => {
    const value = e.target.value;
    setSortRating(value);

    // Sort itineraries based on rating
    let sortedItineraries = [...itineraries];
    if (value === "asc") {
      sortedItineraries.sort((a, b) => a.rating - b.rating);
    } else if (value === "desc") {
      sortedItineraries.sort((a, b) => b.rating - a.rating);
    }
    setItineraries(sortedItineraries);
  };

  return (
    <div id="itineraries">
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <h2 className="title">Upcoming Itineraries</h2>

      {/* Dropdown for sorting itineraries by price */}
      <div className="sort-container">
        <label htmlFor="sortPrice">Sort by Price:</label>
        <select id="sortPrice" value={sortOrder} onChange={handleSortChange}>
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>

        {/* Dropdown for sorting itineraries by rating */}
        <label htmlFor="sortRating">Sort by Rating:</label>
        <select id="sortRating" value={sortRating} onChange={handleSortRatingChange}>
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      {itineraries.length > 0 ? (
        <ul className="itinerary-list">
          {itineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p>
                <strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}
              </p>
              <p>
                <strong>Duration of Activities:</strong>{" "}
                {itinerary.durationActivity.join(", ")} hours
              </p>
              <p>
                <strong>Available Dates:</strong>{" "}
                {itinerary.availableDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </p>
              <p>
                <strong>Activities:</strong>{" "}
                {itinerary.activities
                  .map(
                    (activity) =>
                      `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price}`
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {Array.isArray(itinerary.Tags)
                  ? itinerary.Tags.map((tag) => tag.name).join(", ")
                  : itinerary.Tags.name}
              </p>
              <p>
                <strong>Rating:</strong> {itinerary.rating}
              </p>
              <p>
                <strong>Locations:</strong> {itinerary.locations.join(", ")}
              </p>
              <p>
                <strong>Accessibility:</strong>{" "}
                {itinerary.accessibility.join(", ")}
              </p>
              <p>
                <strong>Pick Up Location:</strong>{" "}
                {itinerary.pickUpLoc.join(", ")}
              </p>
              <p>
                <strong>Drop Off Location:</strong>{" "}
                {itinerary.DropOffLoc.join(", ")}
              </p>
              <p>
                <strong>Bookings:</strong> {itinerary.bookings}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}

      <style>
        {`
          #itineraries {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .title {
            text-align: center;
            color: #000;
            margin-bottom: 20px;
          }
          .sort-container {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .sort-container label {
            margin-right: 10px;
          }
          .itinerary-list {
            list-style: none;
            padding: 0;
          }
          .itinerary-item {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          .itinerary-item:hover {
            transform: translateY(-5px);
          }
          .itinerary-item h3 {
            color: #ff5722;
            margin-bottom: 10px;
          }
          .itinerary-item p {
            margin: 5px 0;
          }
          .error {
            color: red;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default Itineraries;
