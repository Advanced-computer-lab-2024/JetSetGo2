import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import './notifications.css'; // Importing the CSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); // Hook to navigate between routes

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
         ` http://localhost:8000/notifications/${userId}`
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
    <div className="notifications-container">
      <button className="reply-button" onClick={() => navigate(-1)}>
            Back
          </button>
  <h1 className="notification-title">Notification</h1>
  {error && <p className="error-message">{error}</p>}
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className={`notification-item ${notification.read ? "read" : "unread"}`}
          >
            <span style={{ flex: 1 }}>{notification.message}</span>
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                className="mark-read-button"
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