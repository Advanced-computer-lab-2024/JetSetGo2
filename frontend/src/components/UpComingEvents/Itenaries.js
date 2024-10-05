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

  // Fetch itineraries when the component mounts
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const data = await getItineraries(); // Call the service method

      // Filter for upcoming itineraries
      const upcomingItineraries = data.filter((itinerary) => {
        return itinerary.availableDates.some((date) => {
          const itineraryDate = new Date(date);
          const currentDate = new Date();
          return itineraryDate >= currentDate; // Check if any date is in the future
        });
      });

      setItineraries(upcomingItineraries);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Could not fetch itineraries. Please try again later.");
    }
  };

  return (
    <div id="itineraries">
      <h2>Upcoming Itineraries</h2>
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
                  <li key={activity._id}>{activity.name}</li>
                ))}
              </ul>
              <p>Locations: {itinerary.locations.join(", ")}</p>
              <p>Accessibility: {itinerary.accessibility.join(", ")}</p>
              <p>Pick Up Location: {itinerary.pickUpLoc.join(", ")}</p>
              <p>Drop Off Location: {itinerary.DropOffLoc.join(", ")}</p>
              <p>Bookings: {itinerary.bookings}</p>
              {/* <p>Tour Guide: {itinerary.tourGuide.name}</p> */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming itineraries available.</p>
      )}
    </div>
  );
};

export default Itineraries;
