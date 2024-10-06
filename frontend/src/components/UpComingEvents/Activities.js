import React, { useState, useEffect } from "react";
import { getActivity, getCategories } from "../../services/ActivityService";

const predefinedLocations = [
  { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
  { name: "Giza Pyramids, Egypt", coordinates: "31.1313,29.9765,31.1513,29.9965" },
  { name: "Alexandria, Egypt", coordinates: "29.9097,31.2156,29.9297,31.2356" },
  { name: "German University in Cairo, Egypt", coordinates: "31.4486,29.9869,31.4686,30.0069" },
  { name: "Cairo Festival City, Egypt", coordinates: "31.4015,30.0254,31.4215,30.0454" },
];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "", // Changed to minPrice
    maxPrice: "", // Added maxPrice
    rating: "",
  });

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    price: "",
    category: "",
    tags: "",
    specialDiscount: "",
    isBookingOpen: true,
  });

  // Fetch activities and categories when the component mounts
  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getActivity();
      const upcomingActivities = data.filter((activity) => {
        const activityDate = new Date(activity.date);
        const currentDate = new Date();
        return activityDate >= currentDate;
      });
      setActivities(upcomingActivities);
      setFilteredActivities(upcomingActivities); // Set filtered activities initially to all activities
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Date Filter (if provided)
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter((activity) => new Date(activity.date).toDateString() === filterDate.toDateString());
    }

    // Category Filter (if provided)
    if (filters.category) {
      filtered = filtered.filter((activity) => activity.category.name === filters.category);
    }

    // Price Filter (if provided)
    if (filters.minPrice || filters.maxPrice) {
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      filtered = filtered.filter((activity) => activity.price >= minPrice && activity.price <= maxPrice);
    }

    // Rating Filter (if provided)
    if (filters.rating) {
      const ratingLimit = parseFloat(filters.rating);
      filtered = filtered.filter((activity) => activity.rating >= ratingLimit);
    }

    setFilteredActivities(filtered);
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  // Filter change handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Trigger filters when any filter value changes
  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div id="activities">
      <section className="filter-section">
        <h2>Filter Activities</h2>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="price-range">
          <label>Price Range:</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
          />
          <span> - </span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
          />
        </div>
        <div>
          <label>Min Rating:</label>
          <input type="number" name="rating" value={filters.rating} onChange={handleFilterChange} placeholder="Min Rating" />
        </div>
      </section>

      <section className="activity-list">
        <h2>Upcoming Activities</h2>
        {filteredActivities.length > 0 ? (
          <ul>
            {filteredActivities.map((activity) => {
              const locationData = predefinedLocations.find((location) => location.name === activity.location);
              const mapSrc = locationData ? generateMapSrc(locationData.coordinates) : null;

              return (
                <li key={activity._id} className="activity-item">
                  <h3>{activity.category.name}</h3>
                  <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p>Time: {new Date(activity.time).toLocaleTimeString()}</p>
                  <p>Location: {activity.location}</p>
                  <p>Price: ${activity.price}</p>
                  <p>Tags: {activity.tags ? activity.tags.name : "No Tags"}</p>                  <p>Special Discount: {activity.specialDiscount}%</p>
                  <p>Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</p>
                  {mapSrc && (
                    <iframe
                      title={`Map for ${activity.location}`}
                      src={mapSrc}
                      width="300"
                      height="200"
                      style={{ border: "none" }}
                    ></iframe>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No upcoming activities available.</p>
        )}
      </section>
    </div>
  );
};

export default Activities;