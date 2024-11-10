import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom"; // Import useNavigate
import { getHistoricalPlace } from "../../services/HistoricalPlaceService"; // Update this path as needed

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
  { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  { name: "Alexandria, Egypt", coordinates: "29.9097,31.2156,29.9297,31.2356" },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069",
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454",
  },
];
const currencyRates = {
  EUR: 1,    // Base currency (assumed for conversion)
  USD: 1,  // Example conversion rate
  EGP: 30,   // Example conversion rate
};

const HistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency

  // Fetch historical places when the component mounts
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  // Filter the places based on the selected tag
  useEffect(() => {
    if (selectedTag) {
      setFilteredPlaces(
        historicalPlaces.filter(
          (place) => place.tourismGovernerTags?.type === selectedTag
        )
      );
    } else {
      setFilteredPlaces(historicalPlaces);
    }
  }, [selectedTag, historicalPlaces]);

  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Use useLocation to access the state

  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace(); // Use your service method
      setHistoricalPlaces(data);
      setFilteredPlaces(data); // Set filtered places to all initially
    } catch (error) {
      console.error("Error fetching historical places:", error);
      setError("Could not fetch historical places. Please try again later.");
    }
  };

  const handleView = (place) => {
    navigate(`/HP/${place.id}`, { state: { place } });
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };
  // Share by copying the link
  const handleCopybylink = (place) => {
    const link = `http://localhost:3000/HP/${place._id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  // Share via email
  const handleShare = (place) => {
    const subject = encodeURIComponent(`Check out this historical place: ${place.tourismGovernerTags?.name || place.location}`);
    const body = encodeURIComponent(`
      Here are the details of the historical place:
      - Location: ${place.location}
      - Description: ${place.description}
      - Opening Hours: ${place.openingHours}
      - Ticket Price: $${place.ticketPrice}
      You can view more details here: http://localhost:3000/HP/${place._id}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPinPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pinPosition ? <Marker position={pinPosition}></Marker> : null;
  };

  return (
    <div id="historical-places" style={styles.container}>
      <h2 style={styles.heading}>Historical Places</h2>
      {error && <p className="error">{error}</p>}
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="filter-container">
        <label htmlFor="currencySelect">Choose Currency:</label>
        <select
          id="currencySelect"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="EGP">EGP</option>
        </select>
      </div>
      {/* Filter by Tag */}
      <div style={styles.filterContainer}>
        <label htmlFor="tagFilter" style={styles.filterLabel}>
          Filter by Tourism Governor Tag:
        </label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Tags</option>
          {historicalPlaces
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

      {filteredPlaces.length > 0 ? (
  <div style={styles.cardGrid}>
    {filteredPlaces.map((place) => {
      // Extract latitude and longitude from the location string
      const locationCoords = place.location.split(",");
      const latitude = locationCoords[0];
      const longitude = locationCoords[1];
      const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

      return (
        <div key={place._id} style={styles.card}>
          <h3 style={styles.cardTitle}>
            {place.tourismGovernerTags?.name || "Unnamed"}
          </h3>
          <p style={styles.cardText}>Description: {place.description}</p>
          <p style={styles.cardText}>Location: {place.location}</p>
          <p style={styles.cardText}>
            Opening Hours: {place.openingHours}
          </p>
          <p>
                  <strong>Foreigner Ticket Price:</strong> {convertPrice(place.foreignerTicketPrice)} {selectedCurrency}
                </p>
                <p>
                  <strong>Student Ticket Price:</strong> {convertPrice(place.studentTicketPrice)} {selectedCurrency}
                </p>
                <p>
                  <strong>Native Ticket Price:</strong> {convertPrice(place.nativeTicketPrice)} {selectedCurrency}
                  </p>
          <p style={styles.cardText}>
            Ticket Price: ${place.ticketPrice}
          </p>
          <div style={styles.cardImageContainer}>
            <img
              src={place.pictures}
              alt={`Picture of ${place.description}`}
              style={styles.cardImage}
            />
          </div>
          <p style={styles.cardText}>
            Tourism Governor Tags:{" "}
            {place.tourismGovernerTags?.type || "None"}
          </p>
          {/* Map iframe */}
          {mapSrc && (
            <iframe
              title={`Map for ${place.location}`}
              src={mapSrc}
              width="100%"
              height="200"
              style={styles.map}
            ></iframe>
          )}
          <button onClick={() => handleCopybylink(place)}>Share via copy Link</button>
          <button onClick={() => handleShare(place)}>Share via mail </button>
        </div>
        
      );
      
    })}
  </div>
) : (
  <p style={styles.noDataMessage}>No historical places available.</p>
)}

    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  filterContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  filterLabel: {
    marginRight: "10px",
    fontSize: "1rem",
    color: "#555",
  },
  filterSelect: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    maxWidth: "300px",
    width: "100%",
    transition: "transform 0.2s",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.5rem",
    color: "#444",
    marginBottom: "10px",
  },
  cardText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "10px",
  },
  cardImageContainer: {
    height: "150px",
    marginBottom: "10px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  },
  map: {
    marginTop: "15px",
    borderRadius: "5px",
  },
  noDataMessage: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#888",
  },
};

export default HistoricalPlaces;
