import React, { useState, useEffect } from "react";
import axios from "axios";

// Service method to fetch itineraries
const getItineraries = async () => {
  try {
    const response = await axios.get("http://localhost:8000/itinerary/getIteneraries");
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

// Service method to flag an itinerary
const flagItinerary = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/itinerary/flag/${id}`);
  } catch (error) {
    console.error("Error flagging itinerary:", error);
  }
};

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);

  const fetchItineraries = async () => {
    try {
      const response = await getItineraries();
      setItineraries(response); // Store both flagged and unflagged itineraries
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to load itineraries.");
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  // Handle flagging an itinerary
  const handleFlagItinerary = async (id) => {
    await flagItinerary(id);
    // After flagging, refresh the list of available itineraries
    fetchItineraries();
  };

  return (
    <div id="itineraries">
      <h2 className="title">Available Itineraries</h2>

      {error && <p className="error">{error}</p>}

      {itineraries.length > 0 ? (
        <ul className="itinerary-list">
          {itineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p><strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}</p>
              <p><strong>Duration of Activities:</strong> {itinerary.durationActivity.join(", ")} hours</p>
              <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
              <p><strong>Tags:</strong> {Array.isArray(itinerary.Tags) ? itinerary.Tags.map(tag => tag.name).join(", ") : itinerary.Tags.name}</p>
              <p><strong>Rating:</strong> {itinerary.rating}</p>

              {/* Flag button */}
              <button
                className="flag-button"
                onClick={() => handleFlagItinerary(itinerary._id)}
                disabled={itinerary.flagged} // Disable button if already flagged
              >
                {itinerary.flagged ? "Unavailable" : "Flag as Unavailable"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}
    </div>
  );
};

export default Itineraries;
