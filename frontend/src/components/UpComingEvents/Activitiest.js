import React, { useState, useEffect } from "react";
import { getActivity, getCategories } from "../../services/ActivityService";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
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
const currencyRates = {
  EUR: 1,    // Base currency (assumed for conversion)
  USD: 1,  // Example conversion rate
  EGP: 30,   // Example conversion rate
};
const Activitiest = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Added state for sort order
  const [sortBy, setSortBy] = useState("price"); // Added state for sorting by price or rating
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [searchLocation, setSearchLocation] = useState("");
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  const [bookedActivities, setBookedActivities] = useState([]); // Track booked activities

  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Use useLocation to access the state
  const touristId = location.state?.touristId || ""; // Extract touristId from the location state

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchActivities1();
  }, []);

  const handleBookTour = async (id) => {
    console.log("tourist ID:", touristId);
    console.log("hp ID:", id);
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8000/activity/book/${id}`,
        { userId: touristId } // Send touristId in the request body
      );

      if (response.status === 200) {
        // Update the bookings count in the UI
        setBookedActivities((prev) => [...prev, id]); // Mark activity as booked
        alert("activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      alert("already booked");
    }
  };
  const handleShare = (activity) => {
    const activityLink = `http://localhost:3000/activities/${activity._id}`;
    const shareText = `Check out this activity: ${activity.category.name}!\n\n` +
      `📅 Date: ${new Date(activity.date).toLocaleDateString()}\n` +
      `📍 Location: ${activity.location}\n` +
      `💵 Price: $${activity.price}\n` +
      `⭐ Rating: ${activity.rating}\n\n` +
      `🔗 Link: ${activityLink}`;
  
    if (navigator.share) {
      navigator
        .share({
          title: activity.category.name,
          text: shareText,
          url: activityLink,
        })
        .then(() => console.log("Activity shared successfully!"))
        .catch((error) => console.error("Error sharing activity", error));
    } else {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(
        `Activity: ${activity.category.name}`
      )}&body=${encodeURIComponent(shareText)}`;
      window.location.href = mailtoLink;
    }
  };
  
  

  const fetchActivities = async () => {
    try {
      const data = await getActivity();
      const upcomingActivities = data.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= new Date();
      });
      setActivities(upcomingActivities);
      setFilteredActivities(upcomingActivities);

      // Check each activity if it’s already booked by the current user
      const bookedIds = upcomingActivities
        .filter((activity) => activity.bookedUsers.includes(touristId))
        .map((activity) => activity._id);
      setBookedActivities(bookedIds);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  const fetchActivities1 = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      const data = response.data;
      const nonFlaggedActivities = data.filter(activity => !activity.flagged);
      setActivities(nonFlaggedActivities);
      setFilteredActivities(nonFlaggedActivities);
    } catch (error) {
      console.error("Error fetching Activities:", error);
      setError("Failed to load Activities.");
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

    // Sort activities based on selected criteria (price or rating) and order
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [activities, filters, sortOrder, sortBy]); // Add sortOrder and sortBy to the dependency array

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  const handleCancelBooking = async (id) => {
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
  
      // Find the activity that is being canceled
      const activityToCancel = activities.find(activity => activity._id === id);
      if (!activityToCancel) {
        throw new Error("Activity not found.");
      }
  
      const activityDate = new Date(activityToCancel.date); // Convert to Date object
  
      // Calculate the difference in hours
      const hoursDifference = (activityDate - Date.now()) / (1000 * 60 * 60);
      if (hoursDifference < 48) {
        throw new Error("Cancellations are allowed only 48 hours before the activity date.");
      }
  
      // Proceed to cancel the booking only if the 48-hour rule is met
      const response = await axios.post(
        `http://localhost:8000/activity/cancelBooking/${id}`,
        { userId: touristId }
      );
  
      if (response.status === 200) {
        setBookedActivities((prev) => prev.filter((activityId) => activityId !== id)); // Remove activity from booked list
        alert("Booking canceled successfully!");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.message || "An error occurred while canceling the booking.");
    }
  };
  

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // Update sort order state
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value); // Update sorting by price or rating
  };
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };
  const handleViewActivity = (activityId) => {
  navigate(`/activities/${activityId}`, { state: { activityId } });
};
const handleCopy = (activity) => {
  const shareUrl = `http://localhost:3000/activities/${activity._id}`;
  navigator.clipboard.writeText(shareUrl)
    .then(() => alert("Link copied to clipboard"))
    .catch(error => console.error("Error copying link:", error));
};


  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPinPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pinPosition ? <Marker position={pinPosition}></Marker> : null;
  };

  return (
    <div id="activities">
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
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
            <label>Sort by:</label>
            <select value={sortBy} onChange={handleSortByChange}>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div>
            <label>Sort Order:</label>
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
    <ul>
      {filteredActivities.map((activity) => {
        // Extract latitude and longitude from the location string
        const locationCoords = activity.location.split(",");
        const latitude = locationCoords[0];
        const longitude = locationCoords[1];
        const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

        return (
          <li
            key={activity._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            {/* Activity details */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.5em', color: '#333' }}>
                Category: {activity.category.name}
              </h3>
              <p>
                <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
              <p><strong>Time:</strong> {activity.time ? new Date(activity.time).toLocaleTimeString() : "Time not available"}</p>
                
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
              <strong>Price:</strong> {convertPrice(activity.price)} {selectedCurrency}              </p>
              <p>
                <strong>Tags:</strong> {activity.tags ? activity.tags.type : "No Tags"}
              </p>
              <p>
                <strong>Special Discount:</strong> {activity.specialDiscount}%
              </p>
              <p>
                <strong>Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}
              </p>
              <p>
                <strong>Bookings:</strong> {activity.bookings}
              </p>
              <p>
                <strong>Rating:</strong> {activity.rating}
              </p>
              {/* Add a "Book Now" button */}
              {bookedActivities.includes(activity._id) ? (
                    <button onClick={() => handleCancelBooking(activity._id)}>Cancel Booking</button>
                  ) : (
                    <button onClick={() => handleBookTour(activity._id)}>Book Now</button>
                  )}
              <button onClick={() => handleCopy(activity)}>Share via copy Link</button>
                  <button onClick={() => handleShare(activity)}>Share via mail </button>
            </div>

            {/* Map iframe */}
            <iframe
              src={mapSrc}
              width="300"
              height="200"
              style={{ border: 'none' }}
              title={`Map of ${activity.location}`}
            ></iframe>
            {/* {bookedActivities.includes(activity._id) ? (
                    <button onClick={() => handleCancelBooking(activity._id)}>Cancel Booking</button>
                  ) : (
                    <button onClick={() => handleBookTour(activity._id)}>Book Now</button>
                  )} */}
          </li>
        );
      })}
    </ul>
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
        .filter-section, .activity-list {
          margin-bottom: 20px;
        }
        .filter-section h2, .activity-list h2 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .filter-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .filter-inputs div {
          flex: 1;
          min-width: 200px;
        }
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .activity-card {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .back-button-container {
          display: flex;
          justify-content: flex-start;
        }
        .back-button {
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .back-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default Activitiest;
