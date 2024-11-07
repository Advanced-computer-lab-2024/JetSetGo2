import React, { useState, useEffect } from "react";
import { getMuseum } from "../../services/MuseumService"; // Update this path as needed
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

// Fix marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const predefinedLocations = [
  {
    name: "Cairo, Egypt",
    coordinates: "31.2357,30.0444,31.2557,30.0644",
  },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  {
    name: "Alexandria, Egypt",
    coordinates: "29.9097,31.2156,29.9297,31.2356",
  },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069", // Sample bounding box
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454", // Sample bounding box
  },
  // Add more locations as needed
];

const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // For storing selected tag
  const [filteredMuseums, setFilteredMuseums] = useState([]); // For storing filtered museums based on selected tag
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt


  // Fetch museums when the component mounts
  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      // Filter museums by the selected tag
      setFilteredMuseums(
        museums.filter(
          (museum) => museum.tourismGovernerTags?.type === selectedTag
        )
      );
    } else {
      // If no tag is selected, show all museums
      setFilteredMuseums(museums);
    }
  }, [selectedTag, museums]); // Trigger filtering when selectedTag or museums change

  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchMuseums = async () => {
    try {
      const data = await getMuseum();
      setMuseums(data);
    } catch (error) {
      console.error("Error fetching museums:", error);
      setError("Could not fetch museums. Please try again later.");
    }
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div id="museums" style={styles.museumsContainer}>
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <style>{`
        .museum-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          width: 300px;
          margin-bottom: 20px;
        }
        .museum-card h3 {
          color: #333;
        }
        .museum-cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          gap: 20px;
        }
        .museum-image img {
          width: 100%;
          height: auto;
        }
        .filter-container {
          margin-bottom: 20px;
          text-align: center;
        }
        .filter-container select {
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .error {
          color: red;
          text-align: center;
        }
      `}</style>

      <h2
        style={{
          color: "#FF4500",
          fontSize: "24px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Museums
      </h2>
      {error && <p className="error">{error}</p>}

      {/* Filter by Tag */}
      <div className="filter-container">
        <label htmlFor="tagFilter">Filter by Tourism Governor Tag:</label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {museums
            .map((place) => place.tourismGovernerTags?.type)
            .filter(
              (value, index, self) => value && self.indexOf(value) === index
            ) // Remove duplicates
            .map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>
      </div>

      {filteredMuseums.length > 0 ? (
  <div className="museum-cards">
    {filteredMuseums.map((place) => {
      // Extract latitude and longitude from the location string
      const locationCoords = place.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <div key={place._id} className="museum-card">
          <h3>{place.tourismGovernerTags.name || "Unnamed"}</h3>
          <p>
            <strong>Description:</strong> {place.description}
          </p>
          <p>
            <strong>Location:</strong> {place.location}
          </p>
          <p>
            <strong>Opening Hours:</strong> {place.openingHours}
          </p>
          <p>
            <strong>Ticket Price:</strong> ${place.ticketPrice}
          </p>
          <div className="museum-image">
            <img
              src={place.pictures}
              alt={`Picture of ${place.description}`}
            />
          </div>
          <p>
            <strong>Tourism Governor Tags:</strong>{" "}
            {place.tourismGovernerTags?.type || "None"}
          </p>
          {/* Map iframe */}
          {mapSrc && (
            <iframe
              title={`Map for ${place.location}`}
              src={mapSrc}
              width="300"
              height="200"
              style={{ border: "none" }}
            ></iframe>
          )}
        </div>
      );
    })}
  </div>
) : (
  <p>No Museums available.</p>
)}

    </div>
  );
};

const styles = {
  museumsContainer: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
};

export default Museums;
