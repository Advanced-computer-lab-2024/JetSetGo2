import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51QQBfPKbaBifWGn14vu2SZhspEMUJn56AZy9Kcmrq3v8XQv0LDF3rLapvsR6XhA7tZ3YS6vXgk0xgoivUwm03ACZ00NI0XGIMx"
); // Replace with your Stripe publishable key

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      alert("Stripe or client secret is not ready. Please try again.");
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
              name: "Customer Name", // Replace with actual user name if available
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
          hidePostalCode: true, // This disables the ZIP/postal code field
        }}
      />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

// Service method to fetch itineraries

const currencyRates = {
  EUR: 1, // Base currency (assumed for conversion)
  USD: 1, // Example conversion rate
  EGP: 30, // Example conversion rate
};

const Itinerariest = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [error, setError] = useState(null);
  const [currentItineraryId, setCurrentItineraryId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP"); // Default currency

  const [Tags, setTags] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]); 
  const [activities, setActivities] = useState([]);
  const [clientSecret, setClientSecret] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const touristId = location.state?.touristId || ""; // Extract touristId from the location state

  const fetchItineraries = async () => {
    try {
      if (!touristId) {
        console.error("Tourist ID is missing");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/itinerary/readTour`,
        {
          params: { userId: touristId }, // Send touristId as a query parameter
        }
      );

      const data = response.data;

      // Filter out flagged itineraries
      const nonFlaggedItineraries = data.filter(
        (itinerary) => !itinerary.flagged
      );

      setItineraries(nonFlaggedItineraries);
      setFilteredItineraries(nonFlaggedItineraries); // Initially set filtered to all non-flagged itineraries
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to load itineraries.");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:8000/activity/get");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/prefTags/readtag"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching Tags:", error);
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

  useEffect(() => {
    fetchItineraries();
    fetchTags();
    fetchActivities();
    fetchUserPreferences();
  }, []);

  // Filter itineraries based on selected filters
  useEffect(() => {
    let filtered = itineraries;

    if (userPreferences.length > 0) {
      const preferenceIds = userPreferences.map((tag) => tag._id);

      filtered = filtered.filter((itinerary) =>
        Array.isArray(itinerary.Tags)
          ? itinerary.Tags.some((tag) =>
              preferenceIds.includes(tag._id || tag)
            )
          : preferenceIds.includes(itinerary.Tags._id || itinerary.Tags)
      );
    }
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((itinerary) =>
        Array.isArray(itinerary.Tags)
          ? itinerary.Tags.some((tag) => tag.name === selectedTag)
          : itinerary.Tags.name === selectedTag
      );
    }

    // Filter by price
    if (selectedPrice) {
      filtered = filtered.filter(
        (itinerary) =>
          Math.min(...itinerary.TourPrice) <= parseFloat(selectedPrice)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((itinerary) =>
        itinerary.availableDates.some(
          (date) =>
            new Date(date).toDateString() ===
            new Date(selectedDate).toDateString()
        )
      );
    }

    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter((itinerary) =>
        itinerary.tourLanguage.includes(selectedLanguage)
      );
    }

    setFilteredItineraries(filtered);
    console.log("Filtered Itineraries:", filtered); // Log filtered itineraries
  }, [itineraries,userPreferences, selectedTag, selectedPrice, selectedDate, selectedLanguage]);
  // Fetch all itineraries initially
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/allItineraries"
        ); // Replace with your endpoint
        setItineraries(response.data);
        setFilteredItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  // View all itineraries
  const viewAllItineraries = () => {
    setFilteredItineraries(itineraries);
    setShowOnlyBookmarked(false);
  };
  // Handle bookmarking an itinerary
  const handleBookmark = async (itineraryId) => {
    console.log("Tourist ID:", touristId);
    console.log("Itinerary ID:", itineraryId);

    try {
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/bookmarkItinerary/${touristId}/${itineraryId}`
      );

      if (response.status === 200) {
        setBookmarkedItineraries((prev) => {
          if (prev.includes(itineraryId)) {
            // Remove from bookmarks if it was already bookmarked
            return prev.filter((id) => id !== itineraryId);
          } else {
            // Add to bookmarks if not already bookmarked
            return [...prev, itineraryId];
          }
        });
        alert(response.data.message || "Bookmark updated successfully!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert("Failed to toggle bookmark. Please try again.");
    }
  };

  useEffect(() => {
    const fetchBookmarkedItineraries = async () => {
      try {
        if (!touristId) {
          alert("Tourist ID not found. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/bookmarkItinerary/${touristId}`
        );

        if (response.status === 200) {
          setBookmarkedItineraries(response.data.bookmarkedItineraries);
        }
      } catch (error) {
        console.error("Error fetching bookmarked itineraries:", error);
        alert("Failed to load bookmarked itineraries.");
      }
    };

    fetchBookmarkedItineraries();
  }, [touristId]);

  const viewBookmarkedItineraries = async () => {
    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/bookmarkItinerary/${touristId}`
      );

      if (response.status === 200) {
        const bookmarked = response.data.bookmarkedItineraries;
        if (bookmarked.length > 0) {
          setFilteredItineraries(bookmarked); // Set the filtered activities to the bookmarked itineraries
          setShowOnlyBookmarked(true);
        } else {
          alert("No bookmarked itineraries to display.");
          setFilteredItineraries([]); // Clear the filtered activities
        }
      }
    } catch (error) {
      console.error("Error fetching bookmarked itineraries:", error);
      alert("Failed to fetch bookmarked itineraries. Please try again.");
    }
  };
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort(
        (a, b) => Math.min(...a.TourPrice) - Math.min(...b.TourPrice)
      );
    } else if (value === "desc") {
      sortedItineraries.sort(
        (a, b) => Math.max(...b.TourPrice) - Math.max(...a.TourPrice)
      );
    }
    setFilteredItineraries(sortedItineraries);
  };

  const handleSortRatingChange = (e) => {
    const value = e.target.value;
    setSortRating(value);

    let sortedItineraries = [...filteredItineraries];
    if (value === "asc") {
      sortedItineraries.sort((a, b) => a.rating - b.rating);
    } else if (value === "desc") {
      sortedItineraries.sort((a, b) => b.rating - a.rating);
    }
    setFilteredItineraries(sortedItineraries);
  };

  // Function to handle booking the tour
  const handleBookTour = async (id) => {
    const paymentMethod = prompt(
      "Enter payment method (wallet/card):"
    ).toLowerCase();

    if (!touristId) {
      alert("Tourist ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/itinerary/book/${id}`,
        { userId: touristId, paymentMethod, promoCode: "SAVE20" }
      );

      if (response.status === 200) {
        const { clientSecret } = response.data;
        if (paymentMethod === "card" && clientSecret) {
          setCurrentItineraryId(id);
          setClientSecret(clientSecret);
          setIsPaymentModalOpen(true); // Open payment modal
        } else {
          alert(
            response.data.message || "Tour booked successfully using wallet!"
          );
          fetchItineraries(); // Refresh itineraries
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.message); // Display message from backend
      } else {
        console.error("Error initiating booking:", error);
        alert("Error initiating booking. Please try again.");
      }
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      setIsPaymentModalOpen(false);

      // Call backend to finalize booking
      await axios.post(
        `http://localhost:8000/itinerary/finalizeBooking/${currentItineraryId}`,
        {
          userId: touristId, // Send userId to backend
        }
      );

      alert("Tour booked successfully!");
      fetchItineraries(); // Refresh the itineraries to reflect the new booking status
    } catch (error) {
      console.error("Error finalizing booking:", error);
      alert(
        "Booking was successful, but there was an error finalizing it. Please contact support."
      );
    }
  };

  const handleCancelBooking = async (itineraryId, availableDate) => {
    try {
      const hoursUntilTour =
        (new Date(availableDate) - new Date()) / (1000 * 60 * 60);

      if (hoursUntilTour < 48) {
        alert(
          "Cancellation is only allowed at least 48 hours before the itinerary date."
        );
        return;
      }

      await axios.post(
        `http://localhost:8000/itinerary/cancelBooking/${itineraryId}`,
        {
          userId: touristId,
        }
      );

      setFilteredItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === itineraryId
            ? {
                ...itinerary,
                isBooked: false,
                bookings: itinerary.bookings - 1,
              }
            : itinerary
        )
      );
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };

  const handleCopyLink = async (id) => {
    const link = `http://localhost:3000/IT/${id}`;
    navigator.clipboard.writeText(link).then(
      () => alert("Link copied to clipboard!"),
      (err) => alert("Failed to copy the link.")
    );
  };

  const handleShareByEmail = (itinerary) => {
    // Prepare the mailto link
    const subject = encodeURIComponent(
      `Check out this itinerary: ${itinerary.name}`
    );
    const body = encodeURIComponent(`
      Here are the details of the itinerary:
      - Name: ${itinerary.name}
      - Tour Price: ${itinerary.TourPrice.join(", ")}
      - Available Dates: ${itinerary.availableDates
        .map((date) => new Date(date).toLocaleDateString())
        .join(", ")}
      - Rating: ${itinerary.rating}
      
      You can view more details here: http://localhost:3000/IT/${itinerary._id}
    `);

    // Construct the mailto link
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    // Open the email client
    window.location.href = mailtoLink;
  };
  const handleRequestNotification = async (itineraryId) => {
    try {
      console.log("Tourist ID:", touristId); // Add this before the request
      console.log("itineraryId ID:", itineraryId);
      if (!touristId) {
        alert("Tourist ID not found. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/itinerary/requestNotification/${itineraryId}`,
        { userId: touristId }
      );

      if (response.status === 200) {
        alert(
          response.data.message ||
            "Notification request submitted successfully!"
        );
      }
    } catch (error) {
      console.error("Error requesting notification:", error);
      alert("Failed to request notification. Please try again.");
    }
  };

  return (
    <div id="itineraries">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <h2 className="title">Upcoming Itineraries</h2>

      {/* Filter and Sort controls */}
      <div className="sort-container">
        <label htmlFor="filterTag">Filter by Tag:</label>
        <input
          type="text"
          id="filterTag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          placeholder="Enter tag"
        />

        {/* Currency Selection */}
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

        <label htmlFor="filterPrice">Filter by Max Price:</label>
        <input
          type="number"
          id="filterPrice"
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          placeholder="Enter max price"
        />

        <label htmlFor="filterDate">Filter by Date:</label>
        <input
          type="date"
          id="filterDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Sort by Price */}
      <div className="sort-container">
        <label htmlFor="sortPrice">Sort by Price:</label>
        <select id="sortPrice" onChange={handleSortChange}>
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
        <div>
          <button onClick={viewAllItineraries}>View All Itineraries</button>
          <button onClick={viewBookmarkedItineraries}>
            View Bookmarked Itineraries
          </button>
        </div>

        {/* Sort by Rating */}
        <label htmlFor="sortRating">Sort by Rating:</label>
        <select id="sortRating" onChange={handleSortRatingChange}>
          <option value="">Select</option>
          <option value="asc">Lowest to Highest</option>
          <option value="desc">Highest to Lowest</option>
        </select>
      </div>

      {/* Display itineraries */}
      {error && <p className="error">{error}</p>}
      {filteredItineraries.length > 0 ? (
        <ul className="itinerary-list">
          {filteredItineraries.map((itinerary) => (
            <li key={itinerary._id} className="itinerary-item">
              <h3>{itinerary.name}</h3>
              <p>
                <strong>Tour Price:</strong> $
                {convertPrice(itinerary.TourPrice.join(", "))}{" "}
                {selectedCurrency}
              </p>
              <p>
                <strong>Duration of Activities:</strong>{" "}
                {itinerary.durationActivity.join(", ")} hours
              </p>
              <p>
                <strong>Available Dates:</strong>{" "}
                {itinerary.availableDates
                  .map((date) => new Date(date).toLocaleDateString())
                  .join(", ")}
              </p>
              <p>
                <strong>Activities:</strong>{" "}
                {itinerary.activities
                  .map(
                    (activity) =>
                      `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price}`
                  )
                  .join(", ")}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {Array.isArray(itinerary.Tags)
                  ? itinerary.Tags.map((tag) => tag.name).join(", ")
                  : itinerary.Tags.name}
              </p>
              <p>
                <strong>Language:</strong> {itinerary.tourLanguage.join(", ")}
              </p>
              <p>
                <strong>Rating:</strong> {itinerary.rating}
              </p>

              <p>
                <strong>Bookings:</strong> {itinerary.bookings}
              </p>
              <button
                onClick={() => handleBookmark(itinerary._id)}
                style={{
                  backgroundColor: bookmarkedItineraries.includes(itinerary._id)
                    ? "gold"
                    : "white",
                  color: bookmarkedItineraries.includes(itinerary._id)
                    ? "black"
                    : "gray",
                }}
              >
                {bookmarkedItineraries.includes(itinerary._id)
                  ? "Unbookmark"
                  : "Bookmark"}
              </button>
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

              <button onClick={() => handleCopyLink(itinerary._id)}>
                Share via copy Link
              </button>
              <button onClick={() => handleShareByEmail(itinerary)}>
                Share via mail
              </button>

              {itinerary.isActive ? (
                itinerary.isBooked ? (
                  <button
                    onClick={() =>
                      handleCancelBooking(
                        itinerary._id,
                        itinerary.availableDates[0]
                      )
                    }
                  >
                    Cancel Booking
                  </button>
                ) : (
                  <button onClick={() => handleBookTour(itinerary._id)}>
                    Book Tour
                  </button>
                )
              ) : bookmarkedItineraries.includes(itinerary._id) ? ( // Check if itinerary is bookmarked
                <button
                  onClick={() => handleRequestNotification(itinerary._id)}
                >
                  Request Notification
                </button>
              ) : (
                <button
                  onClick={() => handleBookmark(itinerary._id)}
                  style={{
                    backgroundColor: "white",
                    color: "gray",
                    cursor: "pointer",
                  }}
                >
                  Bookmark to Request Notification
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries found.</p>
      )}
    </div>
  );
};

export default Itinerariest;
