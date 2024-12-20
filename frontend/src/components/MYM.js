import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

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
const currencyRates = {
  EUR: 1,    // Base currency (assumed for conversion)
  USD: 1,  // Example conversion rate
  EGP: 30,   // Example conversion rate
};

const Mai = () => {
  const [museums, setMuseums] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // For storing selected tag
  const [filteredMuseums, setFilteredMuseums] = useState([]); // For storing filtered museums based on selected tag
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [bookedHP, setBookedHP] = useState([]); // Track booked activities
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency
  const [reviews, setReviews] = useState({});

  const [submittedReviews, setSubmittedReviews] = useState(
    JSON.parse(localStorage.getItem("submittedReviews")) || {}
  );
  const [itineraryRating, setItineraryRating] = useState(0);
  const [itineraryComment, setItineraryComment] = useState("");
  const touristId = localStorage.getItem("userId");
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
  const getBookedhp = async () => {
    try {
    
      const response = await axios.get(
        "http://localhost:8000/museum/getbookedHP",
        { params: { touristId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  };
  const fetchMuseums = async () => {
    try {
      const data = await getBookedhp();
      setMuseums(data);
      console.log(museums);
    } catch (error) {
      console.error("Error fetching museums:", error);
      setError("Could not fetch museums. Please try again later.");
    }
  };
  

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  // Share by copying the link
  const handleCopybylink = (place) => {
    const link = `http://localhost:3000/M/${place._id}`;
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
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
      You can view more details here: http://localhost:3000/M/${place._id}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  const handleBookTour = async (id) => {
    try {
      console.log("tourist ID:", touristId);
      console.log("hp ID:", id);
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
      const response = await axios.patch(
        `http://localhost:8000/museum/book/${id}`,
        { userId: touristId } // Send touristId in the request body
      );

      if (response.status === 200) {
        // Update the bookings count in the UI
        setBookedHP((prev) => [...prev, id]); // Mark activity as booked
        alert("activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      alert("already booked");
    }
  };
  const handleCancelBooking = async (id) => {
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
  
      // Find the activity that is being canceled
      const HPToCancel = museums.find(Historicalplace => Historicalplace._id=== id);
      if (!HPToCancel) {
        throw new Error("Activity not found.");
      }
  
      const HPDate = new Date(HPToCancel.date); // Convert to Date object
  
      // Calculate the difference in hours
      const hoursDifference = (HPDate - Date.now()) / (1000 * 60 * 60);
      if (hoursDifference < 48) {
        throw new Error("Cancellations are allowed only 48 hours before the activity date.");
      }
  
      // Proceed to cancel the booking only if the 48-hour rule is met
      const response = await axios.post(
        `http://localhost:8000/museum/cancelHP/${id}`,
        { userId: touristId }
      );
  
      if (response.status === 200) {
        setBookedHP((prev) => prev.filter((HPId) => HPId !== id)); // Remove activity from booked list
        alert("Booking canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.message || "An error occurred while canceling the booking.");
    }
  };

  const handleInputChange = (e, itineraryId, field) => {
    const { value } = e.target;
    setReviews((prevReviews) => ({
      ...prevReviews,
      [itineraryId]: {
        ...prevReviews[itineraryId],
        [field]: value,
      },
    }));
  };

  // Submit Review
  const handleItineraryReview = async (itineraryId) => {
    const { rating, comment } = reviews[itineraryId] || {};
    
    if (!rating || !comment) {
      alert("Please provide a rating and a comment.");
      return;
    }

    try {
      // Send review data to backend
      await axios.post(`http://localhost:8000/museum/submitReview/${itineraryId}`, {
        userId: touristId,
        rating,
        comment,
      });

      alert("Museum review submitted!");

      // Clear review inputs after submission
      setReviews((prevReviews) => ({
        ...prevReviews,
        [itineraryId]: { rating: 0, comment: "" },
      }));

      // Update the submitted reviews state and store in localStorage
      const updatedSubmittedReviews = { ...submittedReviews, [itineraryId]: true };
      setSubmittedReviews(updatedSubmittedReviews);
      localStorage.setItem("submittedReviews", JSON.stringify(updatedSubmittedReviews));

    } catch (error) {
      console.error("Error submitting itinerary review:", error);
      alert("Error submitting review. Please try again.");
    }
  };

  


  return (
    <div id="museums" style={styles.museumsContainer}>
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
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
                  <strong>Foreigner Ticket Price:</strong> {convertPrice(place.foreignerTicketPrice)} {selectedCurrency}
                </p>
                <p>
                  <strong>Student Ticket Price:</strong> {convertPrice(place.studentTicketPrice)} {selectedCurrency}
                </p>
                <p>
                  <strong>Native Ticket Price:</strong> {convertPrice(place.nativeTicketPrice)} {selectedCurrency}
                  </p>
                  <p>
                  <strong>Rating:</strong> {place.rating}
                  </p>
                  <div className="reviews">
    <h4>Reviews:</h4>
    {place.reviews && place.reviews.length > 0 ? (
      place.reviews.map((review, index) => (
        <p key={index}>
          <strong>Comment:</strong> {review.comment}
        </p>
      ))
    ) : (
      <p>No reviews yet.</p>
    )}
  </div>

                  
                <div className="museum-image">
                  <img
                    src={place.pictures}
                    alt={`Picture of ${place.description}`}
                  />
                </div>
                <p>
                  <strong>Tourism Governor Tags:</strong> {place.tourismGovernerTags?.type || "None"}
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
  
                {/* Conditional Rendering: Show review section if not submitted */}
                {submittedReviews[place._id] ? (
            <p>Your review has been submitted!</p>
          ) : (
            <>
              <div>
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviews[place._id]?.rating || 0}
                  onChange={(e) => handleInputChange(e, place._id, "rating")}
                  required
                />
              </div>
              <div>
                <label>Comment:</label>
                <textarea
                  value={reviews[place._id]?.comment || ""}
                  onChange={(e) => handleInputChange(e, place._id, "comment")}
                  required
                />
              </div>
              <button onClick={() => handleItineraryReview(place._id)}>
                Submit Review
              </button>
            </>
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

export default Mai;