import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const currencyRates = {
  EUR: 1,
  USD: 1,
  EGP: 30,
};
const MyActivities = () => {
  const [activities, setActivities] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [submittedReviews, setSubmittedReviews] = useState(
    JSON.parse(localStorage.getItem("submittedReviews")) || {}
  );
  const [activityRating, setActivityRating] = useState(0);
  const [activityComment, setActivityComment] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const touristId = location.state?.touristId || "";
  useEffect(() => {
    fetchActivities();
  }, []);
  useEffect(() => {
    // Save submitted reviews to localStorage whenever they change
    localStorage.setItem("submittedReviews", JSON.stringify(submittedReviews));
  }, [submittedReviews]);
  const fetchActivities = async () => {
    try {
      const data = await getBookedactivities(touristId);
      const bookedActivities = data.filter((activity) => {
        // Get today's date
        const today = new Date();
        const activityDate = new Date(activity.date);
        // Filter activities that are before today
        return activity.bookedUsers.includes(touristId) && activityDate < today;
      });
      setActivities(bookedActivities);
      setBookedActivities(bookedActivities.map((activity) => activity._id));
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };
  const handleActivityReview = async (activityId) => {
    try {
      await axios.post(`http://localhost:8000/activity/submitReview/${activityId}`, {
        userId: touristId,
        rating: activityRating,
        comment: activityComment,
      });
      alert("Activity review submitted!");
   
      // Update the state to mark the review as submitted
      const updatedSubmittedReviews = { ...submittedReviews, [activityId]: true };
      setSubmittedReviews(updatedSubmittedReviews);
  
      // Re-fetch updated activities to reflect new review
      await fetchActivities();
    } catch (error) {
      console.error("Error submitting activity review:", error);
    }
  };
  const getBookedactivities = async (touristId) => {
    try {
      if (!touristId) {
        throw new Error("Tourist ID is required");
      }
      const response = await axios.get(
        "http://localhost:8000/activity/getBookedactivities",
        { params: { touristId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  };
  const convertPrice = (price) => {
    return (price * currencyRates[selectedCurrency]).toFixed(2);
  };
  return (
    <div id="activities">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <h2>My Booked Activities</h2>
      <div className="activity-list">
        {activities.map((activity) => (
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
              <strong>Price:</strong> ${convertPrice(activity.price)}{" "}
              {selectedCurrency}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {activity.tags ? activity.tags.type : "No Tags"}
            </p>
            <p>
              <strong>Special Discount:</strong> {activity.specialDiscount}%
            </p>
            <p>
              <strong>Rating:</strong> {activity.rating}
            </p>
            {/* Review Section */}
            {!submittedReviews[activity._id] && (
              <div className="review-section">
                <h4>Rate and Comment on the Activity:</h4>
                <div>
                  <label htmlFor="rating">Rating (1-5):</label>
                  <input
                    type="number"
                    id="activity-rating"
                    value={activityRating}
                    min="1"
                    max="5"
                    onChange={(e) => setActivityRating(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="comment">Comment:</label>
                  <textarea
                    id="activity-comment"
                    value={activityComment}
                    onChange={(e) => setActivityComment(e.target.value)}
                    placeholder="Write your comment here"
                  />
                </div>
                <button onClick={() => handleActivityReview(activity._id)}>
                  Submit Activity Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
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
        .review-section {
          margin-top: 20px;
        }
        .review-section h4 {
          font-size: 18px;
        }
        .review-section input, .review-section textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .review-section button {
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .review-section button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};
export default MyActivities;