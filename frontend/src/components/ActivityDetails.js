import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActById } from "../services/ActivityService";

const ActivityDetails = () => {
  const { id: activityId } = useParams(); // Get the activity ID from the URL parameters
  const [activity, setActivity] = useState(null); // State to store activity details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchActivity = async () => {
      console.log("Activity ID:", activityId); // Check the ID
      try {
        const data = await getActById(activityId); // Fetch activity by ID
        console.log("Fetched activity data:", data); // Debugging log
        setActivity(data); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching activity details:", error);
        alert(`Failed to fetch activity details: ${error.message}`); // Alert for better visibility
      } finally {
        setLoading(false); // Loading is complete
      }
    };

    fetchActivity();
  }, [activityId]);

  if (loading) return <p>Loading activity details...</p>; // Loading message
  if (!activity) return <p>Activity not found.</p>; // Handle case where activity is not found

  // Safely access activity properties
  const categoryName = activity.category ? activity.category.name : "No Category";
  const activityTitle = activity.title || "No Title";
  const activityDate = activity.date ? new Date(activity.date).toLocaleDateString() : "No Date";
  const activityTime = activity.time ? new Date(activity.time).toLocaleTimeString() : "No Time";
  const activityLocation = activity.location || "No Location";
  const activityPrice = activity.price !== undefined ? `$${activity.price}` : "N/A";
  const activitySpecialDiscount = activity.specialDiscount !== undefined ? `${activity.specialDiscount}%` : "0%";
  const activityBookings = activity.bookings !== undefined ? activity.bookings : 0;
  const activityRating = activity.rating !== undefined ? activity.rating : "No Rating";
  const bookingOpenText = activity.isBookingOpen ? "Yes" : "No";
  const activityTags = Array.isArray(activity.tags) 
    ? activity.tags.map(tag => tag.name).join(', ') 
    : "No Tags"; // Extract 'name' from each tag
  const activityDescription = activity.description || "No description available.";

  // Generate map URL if location is available and has latitude/longitude
  let mapSrc = '';
  if (activityLocation && activityLocation.includes(",")) {
    const locationCoords = activityLocation.split(",");
    const latitude = locationCoords[0].trim();
    const longitude = locationCoords[1].trim();
    mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;
  }

  return (
    <div id="activity-details">
      <h2>{categoryName} - {activityTitle}</h2>
      <p><strong>Date:</strong> {activityDate}</p>
      <p><strong>Time:</strong> {activityTime}</p>
      <p><strong>Location:</strong> {activityLocation}</p>
      {mapSrc && (
        <iframe
          src={mapSrc}
          width="250"
          height="200"
          style={{ border: 'none', marginTop: '10px' }}
          title={`Map of ${activityLocation}`}
        ></iframe>
      )}
      <p><strong>Price:</strong> {activityPrice}</p>
      <p><strong>Special Discount:</strong> {activitySpecialDiscount}</p>
      <p><strong>Bookings:</strong> {activityBookings}</p>
      <p><strong>Rating:</strong> {activityRating}</p>
      <p><strong>Booking Open:</strong> {bookingOpenText}</p>
      <p><strong>Tags:</strong> {activityTags}</p>
      <p><strong>Description:</strong> {activityDescription}</p>
    </div>
  );
};

export default ActivityDetails;
