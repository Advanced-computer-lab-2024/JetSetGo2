import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";


// Service method to fetch museums
const getMuseums = async () => {
  try {
    const response = await axios.get("http://localhost:8000/museum/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching museums:", error);
    throw error;
  }
};

// Service method to flag a museum
const flagMuseum = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/museum/flag/${id}`);
  } catch (error) {
    console.error("Error flagging museum:", error);
  }
};

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchMuseums = async () => {
    try {
      const response = await getMuseums();
      setMuseums(response);
    } catch (error) {
      console.error("Error fetching museums:", error);
      setError("Failed to load museums.");
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  // Handle flagging a museum
  const handleFlagMuseum = async (id) => {
    await flagMuseum(id);
    fetchMuseums(); // Refresh list after flagging
  };

  return (
    <div id="Museums">
      <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      <h2 className="title">Available Museums</h2>
      

      {error && <p className="error">{error}</p>}

      {museums.length > 0 ? (
  <ul className="museum-list">
    {museums.map((museum) => {
      // Extract latitude and longitude from the museum location
      const locationCoords = museum.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <li key={museum._id} className="museum-item">
          <h3>{museum.description}</h3>

          {/* Embedded map */}
          <iframe
            src={mapSrc}
            width="250"
            height="200"
            style={{ border: 'none' }}
            title={`Map of ${museum.location}`}
          ></iframe>

          <p><strong>Description:</strong> {museum.description}</p>
          <p><strong>Opening Hours:</strong> {museum.openingHours}</p>
          <p><strong>Foreigner Ticket Price:</strong> ${museum.foreignerTicketPrice}</p>
          <p><strong>Native Ticket Price:</strong> ${museum.nativeTicketPrice}</p>
          <p><strong>Student Ticket Price:</strong> ${museum.studentTicketPrice}</p>
          <p><strong>Flagged:</strong> {museum.flagged ? "Yes" : "No"}</p>

          {/* Flag button */}
          <button
            className="flag-button"
            onClick={() => handleFlagMuseum(museum._id)}
            disabled={museum.flagged} // Disable button if already flagged
          >
            {museum.flagged ? "Unavailable" : "Flag as Unavailable"}
          </button>
        </li>
      );
    })}
  </ul>
) : (
  <p>No museums available.</p>
)}

    </div>
  );
};

export default Museums;
