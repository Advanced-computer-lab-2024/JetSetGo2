import React, { useState, useEffect } from "react";
import axios from "axios";

const TGSales = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activityFilter, setActivityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); // Retrieve the userId

  useEffect(() => {
    const fetchItineraries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/itinerary/bookedItineraries/${userId}`
        );
        setItineraries(response.data);
        setFilteredItineraries(response.data); // Set initially to all itineraries

        // Calculate total revenue
        const total = response.data.reduce((acc, itinerary) => {
          return acc + itinerary.bookings * itinerary.TourPrice * 0.9;
        }, 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setError("Failed to fetch itineraries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [userId]);

  // Apply frontend filtering
  useEffect(() => {
    let filtered = itineraries;

    // Filter by activity
    if (activityFilter) {
      filtered = filtered.filter((itinerary) =>
        itinerary.name?.toLowerCase().includes(activityFilter.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(
        (itinerary) =>
          new Date(itinerary.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter(
        (itinerary) =>
          new Date(itinerary.date).getFullYear() === new Date(monthFilter).getFullYear() &&
          new Date(itinerary.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    setFilteredItineraries(filtered);

    // Recalculate total revenue
    const total = filtered.reduce((acc, itinerary) => {
      return acc + itinerary.bookings * itinerary.TourPrice * 0.9;
    }, 0);
    setTotalRevenue(total);
  }, [activityFilter, dateFilter, monthFilter, itineraries]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Revenue Dashboard</h1>
      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
      <div>
        <input
          type="text"
          placeholder="Filter by activity"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <input
          type="month"
          placeholder="Filter by month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        />
      </div>
      <h3>Booked Itineraries</h3>
      {filteredItineraries.length > 0 ? (
        filteredItineraries.map((itinerary) => (
          <div key={itinerary._id}>
            <h4>Name: {itinerary.name || "Unnamed Itinerary"}</h4>
            <p>Bookings: {itinerary.bookings || 0}</p>
            <p>Price: ${itinerary.TourPrice || 0}</p>
            <p>Revenue from this itinerary: ${(itinerary.TourPrice * itinerary.bookings).toFixed(2)}</p>
            <p>
              Total revenue: $
              {(itinerary.bookings * itinerary.TourPrice * 0.9).toFixed(2)}
            </p>
          </div>
        ))
      ) : (
        <p>No itineraries with bookings found.</p>
      )}
    </div>
  );
};

export default TGSales;
