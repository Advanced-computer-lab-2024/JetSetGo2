import React, { useState, useEffect } from "react";
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
  const [sortOrder, setSortOrder] = useState(""); // State to store the sorting order

  // Fetch itineraries when the component mounts
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await getItineraries(); // Call the service method
      setItineraries(data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Could not fetch itineraries. Please try again later.");
    }
  };

  // Function to handle sorting based on price
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    // Sort itineraries based on price
    let sortedItineraries = [...itineraries];
    if (value === "asc") {
      sortedItineraries.sort(
        (a, b) => Math.min(...a.TourPrice) - Math.min(...b.TourPrice)
      ); // Sort by lowest price
    } else if (value === "desc") {
      sortedItineraries.sort(
        (a, b) => Math.max(...b.TourPrice) - Math.max(...a.TourPrice)
      ); // Sort by highest price
    }
    setItineraries(sortedItineraries); // Update the state with sorted itineraries
  };

  return (
    <div id="itineraries">
      <h2>Itineraries</h2>

      {/* Dropdown for sorting itineraries by price */}
      <label htmlFor="sort">Sort by Price:</label>
      <select id="sort" value={sortOrder} onChange={handleSortChange}>
        <option value="">Select</option>
        <option value="asc">Lowest to Highest</option>
        <option value="desc">Highest to Lowest</option>
      </select>

      {error && <p className="error">{error}</p>}
      {itineraries.length > 0 ? (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p>Tour Price: ${itinerary.TourPrice.join(", ")}</p>
              <p>
                Duration of Activities: {itinerary.durationActivity.join(", ")}{" "}
                hours
              </p>
              <p>
                Available Dates:{" "}
                {itinerary.availableDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </p>
              <p>Activities:</p>
              <ul>
                {itinerary.activities.map((activity) => (
                  <li key={activity._id}>{activity.name}</li> // Ensure 'name' exists in your Activity model
                ))}
              </ul>
              <p>Locations: {itinerary.locations.join(", ")}</p>
              <p>Accessibility: {itinerary.accessibility.join(", ")}</p>
              <p>Pick Up Location: {itinerary.pickUpLoc.join(", ")}</p>
              <p>Drop Off Location: {itinerary.DropOffLoc.join(", ")}</p>
              <p>Bookings: {itinerary.bookings}</p>
              {/* <p>Tour Guide: {itinerary.tourGuide.name}</p>{" "} */}
              {/* Ensure 'name' exists in your Tour model */}
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
