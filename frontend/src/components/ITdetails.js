import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getitenbyID } from '../services/ItenariesServices';

const ItinerariesDetails = () => {
  const { id } = useParams(); // Capture the itinerary ID from the route
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        const data = await getitenbyID(id);
        setItinerary(data);
      } catch (error) {
        console.error("Error fetching itinerary details:", error);
        setError("Failed to load itinerary details.");
      }
    };
    fetchItineraryDetails();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!itinerary) return <p>Loading...</p>;

  return (
    <div>
      <h2>{itinerary.name}</h2>
      <p><strong>Tour Price:</strong> ${itinerary.TourPrice.join(", ")}</p>
      <p><strong>Duration:</strong> {itinerary.durationActivity.join(", ")} hours</p>
      <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default ItinerariesDetails;
