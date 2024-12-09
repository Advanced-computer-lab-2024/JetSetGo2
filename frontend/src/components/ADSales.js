import React, { useState, useEffect } from "react";
import axios from "axios";

const AdvertiserRevenuePage = () => {
  const [activities, setActivities] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredTransportations, setFilteredTransportations] = useState([]);
  const [activityRevenue, setActivityRevenue] = useState(0);
  const [transportationRevenue, setTransportationRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activityFilter, setActivityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const advertiserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAdvertiserRevenue = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/advertiser/revenue/${advertiserId}`
        );

        const {
          activities,
          transportations,
          activityRevenue,
          transportationRevenue,
          totalRevenue,
        } = response.data;

        setActivities(activities);
        setTransportations(transportations);
        setFilteredActivities(activities);
        setFilteredTransportations(transportations);
        setActivityRevenue(activityRevenue);
        setTransportationRevenue(transportationRevenue);
        setTotalRevenue(totalRevenue);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching advertiser revenue:", err);
        setError("Failed to fetch advertiser revenue.");
        setLoading(false);
      }
    };

    fetchAdvertiserRevenue();
  }, [advertiserId]);

  // Apply frontend filtering
  useEffect(() => {
    let filteredActs = activities;
    let filteredTrans = transportations;

    // Filter activities
    if (activityFilter) {
      filteredActs = filteredActs.filter((activity) =>
        activity.category?.name
          .toLowerCase()
          .includes(activityFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      filteredActs = filteredActs.filter(
        (activity) => new Date(activity.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    if (monthFilter) {
      filteredActs = filteredActs.filter(
        (activity) =>
          new Date(activity.date).getFullYear() === new Date(monthFilter).getFullYear() &&
          new Date(activity.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    // Filter transportations (if applicable based on similar criteria)
    if (dateFilter) {
      filteredTrans = filteredTrans.filter(
        (transportation) =>
          new Date(transportation.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }
    if (monthFilter) {
      filteredTrans = filteredTrans.filter(
        (transportation) =>
          new Date(transportation.date).getFullYear() ===
            new Date(monthFilter).getFullYear() &&
          new Date(transportation.date).getMonth() === new Date(monthFilter).getMonth()
      );
    }

    setFilteredActivities(filteredActs);
    setFilteredTransportations(filteredTrans);
  }, [activityFilter, dateFilter, monthFilter, activities, transportations]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Advertiser Revenue Dashboard</h1>

      {/* Filter Controls */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Activity:
          <input
            type="text"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            placeholder="Enter activity name"
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Date:
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Month:
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>

      {/* Activities Revenue Section */}
      <section style={{ marginBottom: "20px" }}>
        <h3>Filtered Activities Revenue</h3>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div
              key={activity._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                background: "#f9f9f9",
              }}
            >
              <h4>Name: {activity.category?.name || "Unnamed Activity"}</h4>
              <p>Bookings: {activity.bookings || 0}</p>
              <p>Price per Booking: ${activity.price || 0}</p>
              <p>
                Revenue from this activity: $
                {(activity.bookings * activity.price * 0.9).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p>No activities match the filters.</p>
        )}
        <h4>Total Activity Revenue: ${activityRevenue.toFixed(2)}</h4>
      </section>

      {/* Transportation Revenue Section */}
      <section style={{ marginBottom: "20px" }}>
        <h3>Filtered Transportation Revenue</h3>
        {filteredTransportations.length > 0 ? (
          filteredTransportations.map((transportation) => (
            <div
              key={transportation._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                background: "#f9f9f9",
              }}
            >
              <h4>Name: {transportation.vehicleType || "Unnamed Transportation"}</h4>
              <p>Price per Booking: ${transportation.price || 0}</p>
              <p>
                Revenue from this transportation: $
                {(transportation.price * 0.9).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p>No transportations match the filters.</p>
        )}
        <h4>Total Transportation Revenue: ${transportationRevenue.toFixed(2)}</h4>
      </section>
    </div>
  );
};

export default AdvertiserRevenuePage;
