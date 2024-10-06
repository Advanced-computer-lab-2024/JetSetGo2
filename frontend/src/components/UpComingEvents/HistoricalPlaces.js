import React, { useState, useEffect } from "react";
import { getHistoricalPlace } from "../../services/HistoricalPlaceService"; // Update this path as needed

const predefinedLocations = [
  { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
  { name: "Giza Pyramids, Egypt", coordinates: "31.1313,29.9765,31.1513,29.9965" },
  { name: "Alexandria, Egypt", coordinates: "29.9097,31.2156,29.9297,31.2356" },
  { name: "German University in Cairo, Egypt", coordinates: "31.4486,29.9869,31.4686,30.0069" },
  { name: "Cairo Festival City, Egypt", coordinates: "31.4015,30.0254,31.4215,30.0454" },
];

const HistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag

  // Fetch historical places when the component mounts
  useEffect(() => {
    fetchHistoricalPlaces();
  }, []);

  // Filter the places based on the selected tag
  useEffect(() => {
    if (selectedTag) {
      setFilteredPlaces(
        historicalPlaces.filter((place) => place.tourismGovernerTags?.name === selectedTag)
      );
    } else {
      setFilteredPlaces(historicalPlaces);
    }
  }, [selectedTag, historicalPlaces]);

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

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  return (
    <div id="historical-places">
      <h2>Historical Places</h2>
      {error && <p className="error">{error}</p>}

      {/* Filter by Tag */}
      <div>
        <label htmlFor="tagFilter">Filter by Tourism Governor Tag:</label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {historicalPlaces
            .map((place) => place.tourismGovernerTags?.name)
            .filter((value, index, self) => value && self.indexOf(value) === index) // Remove duplicates
            .map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
        </select>
      </div>

      {filteredPlaces.length > 0 ? (
        <ul>
          {filteredPlaces.map((place) => {
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

                {/* Display the tags using optional chaining */}
                <p>  Tourism Governor Tags: {
    place.tourismGovernerTags.type
  }</p>
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