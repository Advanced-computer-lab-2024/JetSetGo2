import React, { useState, useEffect } from "react";
import { getActivity, getCategories } from "../../services/ActivityService";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';                    
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../../css/tourist.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Tab,
  Tabs,
  Dropdown,
  Form,
  Button,
} from "react-bootstrap";
import img1 from '../logoo4.JPG';
import { FaPen } from "react-icons/fa"; 
import sidebarImage from '../logoo444.JPG';
const stripePromise = loadStripe(
  "pk_test_51QQBfPKbaBifWGn14vu2SZhspEMUJn56AZy9Kcmrq3v8XQv0LDF3rLapvsR6XhA7tZ3YS6vXgk0xgoivUwm03ACZ00NI0XGIMx"
);
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
const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      alert("Stripe is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "Customer Name", // Replace with the actual user's name
            },
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        onPaymentSuccess(paymentIntent.id); // Pass PaymentIntent ID to finalize booking
      }
    } catch (err) {
      console.error("Error during payment confirmation:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
          hidePostalCode: true,
        }}
      />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
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
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  const [bookedActivities, setBookedActivities] = useState([]); // Track booked activities
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]); // New state for user preferences
  const navigate = useNavigate(); // Initialize useNavigate hook
  const location = useLocation(); // Use useLocation to access the state
  const touristId = location.state?.touristId || ""; // Extract touristId from the location state

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchUserPreferences();
    //fetchActivities1();
  }, []);

  const handleBookTour = async (id) => {
    const paymentMethod = prompt("Enter payment method (wallet/card):").toLowerCase();
  
    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.patch(
        `http://localhost:8000/activity/book/${id}`,
        { userId: touristId, 
          paymentMethod ,
          PromoCode : "SAVE20"
        }
      );
  
      const { clientSecret, message } = response.data;
  
      if (paymentMethod === "card" && clientSecret) {
        setClientSecret(clientSecret);
        setCurrentActivityId(id);
        setIsPaymentModalOpen(true);
      } else {
        // Use the message from the backend
        alert(message || "Activity booked successfully using wallet!");
        alert(message);

        fetchActivities(); // Refresh activities
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      // Check if the error has a response and message
      const errorMessage = error.response?.data?.message || "Error booking activity. Please try again.";
      alert(errorMessage);
    }
  };
  

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setIsPaymentModalOpen(false);

      await axios.post(
        `http://localhost:8000/activity/finalizeBooking/${currentActivityId}`,
        { userId: touristId, paymentIntentId }
      );

      alert("Activity booked successfully!");
      fetchActivities();
    } catch (error) {
      console.error("Error finalizing booking:", error);
      alert("Booking was successful, but there was an error finalizing it.");
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
      console.log(data);
  
      // Filter for upcoming and unflagged activities
      const upcomingActivities = data.filter((activity) => {
        const activityDate = new Date(activity.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set today's date to midnight for accurate comparison
  
        return activityDate >= today && activity.flagged === false;
      });
  
      setActivities(upcomingActivities);
      setFilteredActivities(upcomingActivities);
  
      console.log(activities);
      console.log(filteredActivities);
  
      // Check each activity if it’s already booked by the current user
      const bookedIds = upcomingActivities
        .filter((activity) => activity.bookedUsers.includes(touristId))
        .map((activity) => activity._id);
      setBookedActivities(bookedIds);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };
  

  /*const fetchActivities1 = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      const data = response.data;
      const nonFlaggedActivities = data.filter(activity => !activity.flagged);
      setActivities(nonFlaggedActivities);
      setFilteredActivities(nonFlaggedActivities);
      console.log(activities);
      console.log(filteredActivities);
    } catch (error) {
      console.error("Error fetching Activities:", error);
      setError("Failed to load Activities.");
    }
  };*/
 
  
  const handleBookmark = async (activityId) => {
    console.log("Tourist ID:", touristId);
    console.log("Activity ID:", activityId);
  
    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }
  
      const response = await axios.post(
        `http://localhost:8000/bookmarkActivity/${touristId}/${activityId}`,
        { userId: touristId } // Send touristId in the request body
      );
  
      if (response.status === 200) {
        // Update the bookmarked activities based on the response
        setBookmarkedActivities(response.data.bookmarkedActivities);
        alert(
          response.data.message || 
          "Bookmark toggled successfully!"
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert("Failed to toggle bookmark. Please try again.");
    }
  };
  
  useEffect(() => {
    localStorage.setItem(
      "bookmarkedActivities",
      JSON.stringify(bookmarkedActivities)
    );
  }, [bookmarkedActivities]);
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarkedActivities")) || [];
    console.log("Loaded bookmarks from localStorage:", savedBookmarks);
    setBookmarkedActivities(savedBookmarks);
  }, []);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourists/${touristId}/bookmarks`);
        setBookmarkedActivities(response.data.bookmarkedActivities);
  
        const activitiesResponse = await getActivity();
        setActivities(activitiesResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (touristId) {
      fetchInitialData();
    }
  }, [touristId]);
    
 
  // View all activities
  const viewAllActivities = () => {
    setFilteredActivities(activities); // Reset to show all activities
    setShowOnlyBookmarked(false);
  };

  const viewBookmarkedActivities = async () => {
    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:8000/bookmarkActivity/${touristId}`
      );
  
      if (response.status === 200) {
        const bookmarked = response.data.bookmarkedActivities;
        if (bookmarked.length > 0) {
          setFilteredActivities(bookmarked); // Set filtered activities to the bookmarked ones
          setShowOnlyBookmarked(true);
        } else {
          alert("No bookmarked activities to display.");
          setFilteredActivities([]); // Clear filtered activities if no bookmarks exist
        }
      }
    } catch (error) {
      console.error("Error fetching bookmarked activities:", error);
      alert("Failed to fetch bookmarked activities. Please try again.");
    }
  };
  
 // Frontend Code
const handleRequestNotification = async (activityId) => {
  try {
    console.log("Tourist ID:", touristId); // Log touristId
    console.log("Activity ID:", activityId); // Log activityId

    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }

    const response = await axios.post(
      `http://localhost:8000/activity/requestNotification/${activityId}`, // Ensure activityId is included in the URL
      { userId: touristId } // Pass touristId in the body
    );

    if (response.status === 200) {
      alert(response.data.message || "Notification request submitted successfully!");
    }
  } catch (error) {
    console.error("Error requesting notification:", error);
    alert("Failed to request notification. Please try again.");
  }
};

  
  
  
  
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedActivities')) || [];
    setBookmarkedActivities(savedBookmarks);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('bookmarkedActivities', JSON.stringify(bookmarkedActivities));
  }, [bookmarkedActivities]);
     // Initialize filteredActivities with all activities
  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/home/tourist/preferences/${touristId}`
      );
      setUserPreferences(response.data); // Store the full tag objects
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };


  const applyFilters = () => {
    let filtered = [...activities];
  
    if (userPreferences.length > 0) {
      const preferenceIds = userPreferences.map((tag) => tag._id);
    
      filtered = filtered.filter((activity) =>
        activity.tags && preferenceIds.includes(activity.tags._id || activity.tags)
      );
    }
  
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
  }, [activities, filters, sortOrder, sortBy, userPreferences]); // Add sortOrder and sortBy to the dependency array

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
    <div className="tourist-page">
    {/* Navbar */}
    <Navbar className="navbar">
      <Container>
      <Navbar.Brand href="#" className="advertiser-navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* Cart Icon */}
            <Nav.Link href="#" onClick={() => navigate("/cart")}>
              <i
                className="fas fa-shopping-cart"
                style={{ fontSize: "20px" }}
              ></i>
            </Nav.Link>

            {/* Wishlist Icon */}
            <Nav.Link href="#" onClick={() => navigate("/wishlist")}>
              <i className="fas fa-heart" style={{ fontSize: "20px" }}></i>
            </Nav.Link>

            {/* Notification Bell Icon */}
            <Nav.Link href="#" onClick={() => navigate("/notifications")}>
              <i className="fas fa-bell" style={{ fontSize: "20px" }}></i>
            </Nav.Link>

            {/* Tourist Dropdown */}
            <Nav.Link className="profile-nav">
              <img
                src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg"
                alt="Profile"
                className="navbar-profile-image"
              />
            </Nav.Link>
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <div id="activities">
      
         {isPaymentModalOpen && (
      <div className="payment-modal">
        <Elements stripe={stripePromise}>
          <PaymentForm
            clientSecret={clientSecret}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    )}
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
            <button onClick={viewBookmarkedActivities}>View Bookmarked Activities</button>
            <button onClick={viewAllActivities}>View All Activities</button>
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
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <strong>Price:</strong> ${convertPrice(activity.price)} {selectedCurrency}
              </p>
              <p>
                <strong>Tags:</strong> {activity.tags ? activity.tags.name : "No Tags"}
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
        
              {/* Separate Bookmark Button */}
              <button
                onClick={() => handleBookmark(activity._id)}
                style={{
                  backgroundColor: bookmarkedActivities.includes(activity._id)
                    ? "gold"
                    : "white",
                  color: bookmarkedActivities.includes(activity._id) ? "black" : "gray",
                }}
              >
                {bookmarkedActivities.includes(activity._id) ? "Unbookmark" : "Bookmark"}
              </button>
        
              {/* Button for Request Notification or Book Now */}
              {activity.isActive ? (
                bookedActivities.includes(activity._id) ? (
                  <button onClick={() => handleCancelBooking(activity._id)}>
                    Cancel Booking
                  </button>
                ) : (
                  <button onClick={() => handleBookTour(activity._id)}>Book Now</button>
                )
              ) : bookmarkedActivities.includes(activity._id) ? (
                <button onClick={() => handleRequestNotification(activity._id)}>
                  Request Notification
                </button>
              ) : (
                <button
                  onClick={() => alert("Bookmark the activity to request notifications.")}
                  style={{
                    backgroundColor: "white",
                    color: "gray",
                    cursor: "pointer",
                  }}
                >
                  Request Notification
                </button>
              )}
        
              <button onClick={() => handleCopy(activity)}>Share via copy Link</button>
              <button onClick={() => handleShare(activity)}>Share via mail</button>
            </div>
        
            {/* Map iframe */}
            <iframe
              src={mapSrc}
              width="300"
              height="200"
              style={{ border: 'none' }}
              title={`Map of ${activity.location}`}
            ></iframe>
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
    </div>
  );
};

export default Activitiest;
