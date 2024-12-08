import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ItinerariesPagee = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);
  const [submittedReviews, setSubmittedReviews] = useState(
    JSON.parse(localStorage.getItem("submittedReviews")) || {}
  );
  const [submittedGuideReviews, setSubmittedGuideReviews] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const touristId = location.state?.touristId || "";

  const [itineraryRating, setItineraryRating] = useState(0);
  const [itineraryComment, setItineraryComment] = useState("");
  const [guideRating, setGuideRating] = useState(0);
  const [guideComment, setGuideComment] = useState("");

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const bookedItineraries = await getBookedItineraries(touristId);
        // Get today's date
        const today = new Date();

        // Filter itineraries that have dates before today
        const filteredItineraries = bookedItineraries.filter((itinerary) => {
          // Assuming availableDates is an array and each date is a string in ISO format
          return itinerary.availableDates.some((date) => new Date(date) > today);
        });

        setItineraries(filteredItineraries);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setError("Failed to load itineraries.");
      }
    };

    fetchItineraries();
  }, [touristId]);

  const getBookedItineraries = async (touristId) => {
    try {
      if (!touristId) {
        throw new Error("Tourist ID is required");
      }

      console.log("Fetching itineraries for touristId:", touristId);

      const response = await axios.get(
        "http://localhost:8000/itinerary/getBookedItineraries",
        { params: { touristId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      throw error;
    }
  };


  return (
    <div id="itineraries">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <h2 className="title">Your Booked Itineraries</h2>

      {error && <p className="error">{error}</p>}
      {itineraries.length > 0 ? (
        <ul className="itinerary-list">
          {itineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p><strong>Tour Price:</strong> {itinerary.TourPrice.join(", ")}</p>
              <p><strong>Duration of Activities:</strong> {itinerary.durationActivity.join(", ")} hours</p>
              <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
              <p><strong>Language:</strong> {itinerary.tourLanguage.join(", ")}</p>
              <p><strong>Rating:</strong> {itinerary.rating}</p>

             
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries booked yet.</p>
      )}
    </div>
  );
};

export default ItinerariesPagee;
