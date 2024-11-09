import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
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



const Itinerariest = () => {
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

  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Use useLocation to access the state
  const touristId = location.state?.touristId || ""; // Extract touristId from the location state
  const fetchItineraries = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/itinerary/readTourId`
      );
      setItineraries(response.data);
      setFilteredItineraries(response.data); // Initially set filtered to all itineraries
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
        (a, b) => Math.min(...a.TourPrice) - Math.min(...b.TourPrice)
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

  const handleCopyLink = async (id) => {
    const link = `http://localhost:3001/IT/${id}`;
    navigator.clipboard.writeText(link).then(
      () => alert("Link copied to clipboard!"),
      (err) => alert("Failed to copy the link.")
    );
  };

  
  const handleShareByEmail = (itinerary) => {
    // Prepare the mailto link
    const subject = encodeURIComponent(`Check out this itinerary: ${itinerary.name}`);
    const body = encodeURIComponent(`
      Here are the details of the itinerary:
      - Name: ${itinerary.name}
      - Tour Price: ${itinerary.TourPrice.join(", ")}
      - Available Dates: ${itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}
      - Rating: ${itinerary.rating}
      
      You can view more details here: http://localhost:3001/IT/${itinerary._id}
    `);
    
    // Construct the mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Open the email client
    window.location.href = mailtoLink;
  };
  
  
  // Function to handle booking the tour
  const handleBookTour = async (id) => {
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8000/itinerary/book/${id}`,
        { userId: touristId } // Send touristId in the request body
      );

      if (response.status === 200) {
        // Update the bookings count in the UI
        setFilteredItineraries((prevItineraries) =>
          prevItineraries.map((itinerary) =>
            itinerary._id === id
              ? { ...itinerary, bookings: itinerary.bookings + 1 }
              : itinerary
          )
        );
        alert("Tour booked successfully!");
      }
    } catch (error) {
      console.error("Error booking tour:", error);
      alert("Failed to book the tour.");
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
                <strong>Rating:</strong> {itinerary.rating}
              </p>
              <p>
                <strong>Bookings:</strong> {itinerary.bookings}
              </p>

              {/* Add a "Book Now" button */}
              <button onClick={() => handleBookTour(itinerary._id)}>
                Book Now
              </button>
              <button onClick={() => handleCopyLink(itinerary._id)}>Share via copy Link</button>
              <button onClick={() => handleShareByEmail(itinerary)}>Share via mail</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}
    </div>
  );
};

export default Itinerariest;
