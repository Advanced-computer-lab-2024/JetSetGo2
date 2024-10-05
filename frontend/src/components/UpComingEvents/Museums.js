import React, { useState, useEffect } from "react";
import { getMuseum } from 'C:/ACL PROJECT/JetSetGo2/frontend/src/services/MuseumService'; // Update this path as needed

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

  // Fetch museums when the component mounts
  useEffect(() => {
    fetchMuseums();
  }, []);

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
    <div id="museums">
      <h2>Museums</h2>
      {error && <p className="error">{error}</p>}
      {museums.length > 0 ? (
        <ul>
          {museums.map((museum) => {
            const locationData = predefinedLocations.find(
              (location) => location.name === museum.location
            );
            const mapSrc = locationData
              ? generateMapSrc(locationData.coordinates)
              : null;

            return (
              <li key={museum._id} className="museum-item">
                <h3>{museum.description}</h3>
                <p>Location: {museum.location}</p>
                <p>Opening Hours: {museum.openingHours}</p>
                <p>Ticket Price: ${museum.ticketPrice}</p>
                <p>
                  Pictures:{" "}
                  <img
                    src={museum.pictures}
                    alt={`Picture of ${museum.description}`}
                    style={{ width: "100px", height: "auto" }}
                  />
                </p>
                {mapSrc && (
                  <iframe
                    title={`Map for ${museum.location}`}
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
        <p>No museums available.</p>
      )}
    </div>
  );
};

export default Museums;
