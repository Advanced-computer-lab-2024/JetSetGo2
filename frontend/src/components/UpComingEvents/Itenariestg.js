import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Service method to fetch itineraries
const getItineraries = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/itinerary/getIteneraries`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    throw error;
  }
};

// Service method to toggle activation of an itinerary
const toggleItineraryActivation = async (id) => {
  try {
    console.log(`Toggling activation for itinerary with ID: ${id}`); // Log request
    const response = await axios.patch(
      `http://localhost:8000/itinerary/toggleActivation/${id}`
    );
    console.log(`Response from toggle activation:`, response.data); // Log response
    return response.data;
  } catch (error) {
    console.error("Error toggling activation:", error);
    throw error;
  }
};

const Itinerariestg = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]); // To store filtered itineraries
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [Tags, setTags] = useState([]);
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      const response = await getItineraries();
      setItineraries(response);
      setFilteredItineraries(response); // Initially set filtered to all itineraries
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to load itineraries.");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/prefTags/readtag"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching Tags:", error);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchTags();
    fetchActivities();
  }, []);

  // Filter itineraries based on selected filters
  useEffect(() => {
    let filtered = itineraries;

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((itinerary) =>
        Array.isArray(itinerary.Tags)
          ? itinerary.Tags.some((tag) => tag.name === selectedTag)
          : itinerary.Tags.name === selectedTag
      );
    }

    // Filter by price
    if (selectedPrice) {
      filtered = filtered.filter(
        (itinerary) =>
          Math.min(...itinerary.TourPrice) <= parseFloat(selectedPrice)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((itinerary) =>
        itinerary.availableDates.some(
          (date) =>
            new Date(date).toDateString() ===
            new Date(selectedDate).toDateString()
        )
      );
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter((itinerary) =>
        itinerary.tourLanguage.includes(selectedLanguage)
      );
    }

    setFilteredItineraries(filtered);
  }, [itineraries, selectedTag, selectedPrice, selectedDate, selectedLanguage]);

  // Sorting functions remain unchanged
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort(
        (a, b) => Math.min(...a.TTourPrice) - Math.min(...b.TourPrice)
      );
    } else if (value === "desc") {
      sortedItineraries.sort(
        (a, b) => Math.max(...b.TourPrice) - Math.max(...a.TourPrice)
      );
    }
    setFilteredItineraries(sortedItineraries);
  };

  const handleSortRatingChange = (e) => {
    const value = e.target.value;
    setSortRating(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort((a, b) => a.rating - b.rating);
    } else if (value === "desc") {
      sortedItineraries.sort((a, b) => b.rating - a.rating);
    }
    setFilteredItineraries(sortedItineraries);
  };


// Toggle activation handler
const handleToggleActivation = async (id) => {
    try {
      console.log(`Handling toggle activation for ID: ${id}`);
      const updatedItinerary = await toggleItineraryActivation(id);
      console.log("Updating itinerary in the state...");
  
      // Update the specific itinerary in the state
      setItineraries((prevItineraries) => {
        const updated = prevItineraries.map((itinerary) => {
          // Check if the itinerary ID matches the toggled one
          if (itinerary._id === updatedItinerary.itinerary._id) {
            // Merge the updated fields with the existing fields to preserve `activities` and others
            return {
              ...itinerary, // Preserve the existing fields
              isActive: updatedItinerary.itinerary.isActive, // Update only the status
            };
          }
          return itinerary; // Return unchanged itineraries
        });
        console.log("Updated itineraries:", updated);
        return updated;
      });
  
      // Optionally, you can also update filtered itineraries
      setFilteredItineraries((prevItineraries) => {
        const updated = prevItineraries.map((itinerary) => {
          if (itinerary._id === updatedItinerary.itinerary._id) {
            return {
              ...itinerary,
              isActive: updatedItinerary.itinerary.isActive,
            };
          }
          return itinerary;
        });
        console.log("Updated filtered itineraries:", updated);
        return updated;
      });
    } catch (error) {
      console.error("Error toggling activation:", error);
      setError("Failed to toggle activation.");
    }
  };
  

  return (
    <div id="itineraries">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <h2 className="title">Upcoming Itineraries</h2>

      {/* Filter and Sort controls */}
      <div className="sort-container">
        <label htmlFor="filterTag">Filter by Tag:</label>
        <input
          type="text"
          id="filterTag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          placeholder="Enter tag"
        />

        <label htmlFor="filterPrice">Filter by Max Price:</label>
        <input
          type="number"
          id="filterPrice"
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          placeholder="Enter max price"
        />

        <label htmlFor="filterDate">Filter by Date:</label>
        <input
          type="date"
          id="filterDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Sort by Price */}
      <div className="sort-container">
        <label htmlFor="sortPrice">Sort by Price:</label>
        <select id="sortPrice" value={sortOrder} onChange={handleSortChange}>
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>

        {/* Sort by Rating */}
        <label htmlFor="sortRating">Sort by Rating:</label>
        <select
          id="sortRating"
          value={sortRating}
          onChange={handleSortRatingChange}
        >
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {/* Display itineraries */}
      {error && <p className="error">{error}</p>}

      {filteredItineraries.length > 0 ? (
        <ul className="itinerary-list">
          {filteredItineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p>
                <strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}
              </p>
              <p>
                <strong>Duration of Activities:</strong>{" "}
                {itinerary.durationActivity.join(", ")} hours
              </p>
              <p>
                <strong>Available Dates:</strong>{" "}
                {itinerary.availableDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </p>
              <p>
                <strong>Activities:</strong>{" "}
                {itinerary.activities
                  .map(
                    (activity) =>
                      `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price}`
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {Array.isArray(itinerary.Tags)
                  ? itinerary.Tags.map((tag) => tag.name).join(", ")
                  : itinerary.Tags.name}
              </p>
              <p>
                <strong>Languages:</strong>{" "}
                {itinerary.tourLanguage.join(", ")}
              </p>
              <p>
                <strong>Number of Bookings:</strong> {itinerary.bookings}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {itinerary.isActive ? "Active" : "Deactivated"}
              </p>

              {/* Toggle activation button */}
              <button
                onClick={() => handleToggleActivation(itinerary._id)}
                className={itinerary.isActive ? "deactivate-btn" : "activate-btn"}
              >
                {itinerary.isActive ? "Deactivate" : "Activate"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}
    </div>
  );
};

export default Itinerariestg;
