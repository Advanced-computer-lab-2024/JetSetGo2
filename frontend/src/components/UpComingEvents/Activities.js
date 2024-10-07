import React, { useState, useEffect } from "react";
import { getActivity, getCategories } from "../../services/ActivityService";

const predefinedLocations = [
  { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  { name: "Alexandria, Egypt", coordinates: "29.9097,31.2156,29.9297,31.2356" },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069",
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454",
  },
];

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Added state for sort order

  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });

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
      setFilteredActivities(upcomingActivities);
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

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(
        (activity) =>
          new Date(activity.date).toDateString() === filterDate.toDateString()
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(
        (activity) => activity.category.name === filters.category
      );
    }

    // Apply price range filter
    if (filters.minPrice || filters.maxPrice) {
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      filtered = filtered.filter(
        (activity) => activity.price >= minPrice && activity.price <= maxPrice
      );
    }

    // Apply rating filter
    if (filters.rating) {
      const ratingLimit = parseFloat(filters.rating);
      filtered = filtered.filter((activity) => activity.rating >= ratingLimit);
    }

    // Sort activities by price based on selected order
    filtered.sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, sortOrder]); // Add sortOrder to the dependency array

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // Update sort order state
  };

  return (
    <div id="activities">
      <section className="filter-section">
        <h2>Filter Activities</h2>
        <div className="filter-inputs">
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
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
            <input
              type="number"
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              placeholder="Min Rating"
            />
          </div>
          <div>
            <label>Sort by Price:</label>
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>

      <section className="activity-list">
        <h2>Upcoming Activities</h2>
        {filteredActivities.length > 0 ? (
          <div className="activity-grid">
            {filteredActivities.map((activity) => {
              const locationData = predefinedLocations.find(
                (location) => location.name === activity.location
              );
              const mapSrc = locationData
                ? `https://www.openstreetmap.org/export/embed.html?bbox=${
                    locationData.coordinates
                  }&layer=mapnik&marker=${
                    locationData.coordinates.split(",")[1]
                  },${locationData.coordinates.split(",")[0]}`
                : null;

              return (
                <div key={activity._id} className="activity-card">
                  <h3>{activity.category.name}</h3>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(activity.time).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {activity.location}
                  </p>
                  <p>
                    <strong>Price:</strong> ${activity.price}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {activity.tags ? activity.tags.name : "No Tags"}
                  </p>
                  <p>
                    <strong>Special Discount:</strong>{" "}
                    {activity.specialDiscount}%
                  </p>
                  <p>
                    <strong>Booking Open:</strong>{" "}
                    {activity.isBookingOpen ? "Yes" : "No"}
                  </p>
                  {mapSrc && (
                    <iframe
                      title={`Map for ${activity.location}`}
                      src={mapSrc}
                      width="300"
                      height="200"
                      style={{ border: "none" }}
                    ></iframe>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>No upcoming activities available.</p>
        )}
      </section>
      <style>{`
        #activities {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .filter-section {
          margin-bottom: 20px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .filter-section h2 {
          margin-bottom: 15px;
        }
        .filter-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .filter-inputs div {
          flex: 1;
          min-width: 150px;
        }
        .activity-list {
          padding: 20px;
        }
        .activity-list h2 {
          margin-bottom: 20px;
        }
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .activity-card {
          padding: 15px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
        .activity-card h3 {
          margin-top: 0;
        }
        @media (max-width: 600px) {
          .filter-inputs {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Activities;
