import React, { useState, useEffect } from "react";
import { getHistoricalPlace } from '../../services/HistoricalPlaceService'; // Update this path as needed

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

const HistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [error, setError] = useState(null);

  // Fetch historical places when the component mounts
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  const fetchHistoricalPlaces = async () => {
    try {
      const data = await getHistoricalPlace(); // Use your service method
      setHistoricalPlaces(data);
    } catch (error) {
      console.error("Error fetching historical places:", error);
      setError("Could not fetch historical places. Please try again later.");
    }
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div id="historical-places">
      <h2>Historical Places</h2>
      {error && <p className="error">{error}</p>}
      {historicalPlaces.length > 0 ? (
        <ul>
          {historicalPlaces.map((place) => {
            const locationData = predefinedLocations.find(
              (location) => location.name === place.location
            );
            const mapSrc = locationData
              ? generateMapSrc(locationData.coordinates)
              : null;

            return (
              <li key={place._id} className="historical-place-item">
                <h3>{place.description}</h3>
                <p>Location: {place.location}</p>
                <p>Opening Hours: {place.openingHours}</p>
                <p>Ticket Price: ${place.ticketPrice}</p>
                <p>
                  Pictures:{" "}
                  <img
                    src={place.pictures}
                    alt={`Picture of ${place.description}`}
                    style={{ width: "100px", height: "auto" }}
                  />
                </p>
                {mapSrc && (
                  <iframe
                    title={`Map for ${place.location}`}
                    src={mapSrc}
                    width="300"
                    height="200"
                    style={{ border: "none" }}
                  ></iframe>
                )}
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
