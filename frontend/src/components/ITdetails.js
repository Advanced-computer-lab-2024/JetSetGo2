import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getitenbyID } from "../services/ItenariesServices";

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
      <p><strong>Duration of Activities:</strong> {itinerary.durationActivity.join(", ")} hours</p>
      <p><strong>Available Dates:</strong> {itinerary.availableDates.map(date => new Date(date).toLocaleDateString()).join(", ")}</p>
      
      <p><strong>Activities:</strong></p>
      <ul>
        {itinerary.activities.map((activity, index) => (
          <li key={index}>
            {activity.date} - {activity.time} - {activity.location} - ${activity.price}
          </li>
        ))}
      </ul>

      <p><strong>Tags:</strong> {Array.isArray(itinerary.Tags) ? itinerary.Tags.map(tag => tag.name).join(", ") : itinerary.Tags.name}</p>
      <p><strong>Rating:</strong> {itinerary.rating}</p>
      <p><strong>Bookings:</strong> {itinerary.bookings}</p>

      {/* Add additional attributes as needed */}
      <p><strong>Description:</strong> {itinerary.description}</p>
      <p><strong>Languages Available:</strong> {itinerary.tourLanguage.join(", ")}</p>
    </div>
  );
};

export default ItinerariesDetails;
