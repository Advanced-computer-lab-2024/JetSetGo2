import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId"); // Get the user ID from local storage

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/notifications/${userId}`
        );
        setNotifications(response.data);
      } catch (err) {
        setError("Failed to fetch notifications.");
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `http://localhost:8000/notifications/read/${notificationId}`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Notifications
      </h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {notifications.map((notification) => (
          <li
            key={notification._id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: notification.read ? "#f8f9fa" : "#dff0d8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ flex: 1 }}>{notification.message}</span>
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
