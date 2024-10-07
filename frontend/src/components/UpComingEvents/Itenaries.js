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
  const [sortOrder, setSortOrder] = useState(""); 
  const [Tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);

  // Fetch itineraries when the component mounts
 

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/itinerary/readTourId`);
      setItineraries(response.data);
      console.log('dataaaa= ' , response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };
  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/activity/get');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/prefTags/readtag');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching Tags:', error);
    }
  };
  useEffect(() => {
    fetchItineraries();
    fetchTags();
    fetchActivities();
  }, []);
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
              <p>Activities: 
                  {itinerary.activities.map(activity => 
                      `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price} - ${activity.category} - ${activity.specialDiscount}`
                  ).join(', ')}
              </p>
              <p>Tags: {Array.isArray(itinerary.Tags) ? itinerary.Tags.map(tag => tag.name).join(', ') : itinerary.Tags.name}</p>

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
