import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

// Service method to fetch historical places
const getHistoricalPlace = async () => {
  try {
    const response = await axios.get("http://localhost:8000/historicalPlace/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching HistoricalPlaces:", error);
    throw error;
  }
};

// Service method to flag a historical place
const flagHistoricalPlace = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/historicalPlace/flag/${id}`);
  } catch (error) {
    console.error("Error flagging HistoricalPlaces:", error);
  }
};

const HistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace();
      setHistoricalPlaces(data); // Store both flagged and unflagged places
    } catch (error) {
      console.error("Error fetching historical places:", error);
      setError("Failed to load historical places.");
    }
  };

  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  // Handle flagging a historical place
  const handleFlagHistoricalPlace = async (id) => {
    await flagHistoricalPlace(id);
    fetchHistoricalPlaces(); // Refresh list after flagging
  };

  return (
    <div id="HistoricalPlaces">
      <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      <h2 className="title">Available Historical Places</h2>

      {error && <p className="error">{error}</p>}

      {historicalPlaces.length > 0 ? (
  <ul className="historical-place-list">
    {historicalPlaces.map((place) => {
      // Extract latitude and longitude from the place location
      const locationCoords = place.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <li key={place._id} className="historical-place-item">
          <h3>{place.description}</h3>

          {/* Embedded map */}
          <iframe
            src={mapSrc}
            width="250"
            height="200"
            style={{ border: 'none' }}
            title={`Map of ${place.location}`}
          ></iframe>

          <p><strong>Description:</strong> {place.description}</p>
          <p><strong>Opening Hours:</strong> {place.openingHours}</p>
          <p><strong>Foreigner Ticket Price:</strong> ${place.foreignerTicketPrice}</p>
          <p><strong>Native Ticket Price:</strong> ${place.nativeTicketPrice}</p>
          <p><strong>Student Ticket Price:</strong> ${place.studentTicketPrice}</p>
          <p><strong>Flagged:</strong> {place.flagged ? "Yes" : "No"}</p>

          {/* Flag button */}
          <button
            className="flag-button"
            onClick={() => handleFlagHistoricalPlace(place._id)}
            disabled={place.flagged} // Disable button if already flagged
          >
            {place.flagged ? "Unavailable" : "Flag as Unavailable"}
          </button>
        </li>
      );
    })}
  </ul>
) : (
  <p>No historical places available.</p>
)}

    </div>
  );
};

export default HistoricalPlaces;
