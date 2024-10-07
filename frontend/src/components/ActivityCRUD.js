import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../App.css";
import {
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getCategories,
  getAdvertiser,
  getActivityById,
  getTags,
} from "../services/ActivityService"; // Ensure to import the necessary services

const predefinedLocations = [
  {
    name: "Cairo, Egypt",
    coordinates: "31.2357,30.0444,31.2557,30.0644",
  },
  {
    name: "Giza Pyramids, Egypt",
    coordinates: "31.1313,29.9765,31.1513,29.9965",
  },
  {
    name: "Alexandria, Egypt",
    coordinates: "29.9097,31.2156,29.9297,31.2356",
  },
  {
    name: "German University in Cairo, Egypt",
    coordinates: "31.4486,29.9869,31.4686,30.0069", // Sample bounding box
  },
  {
    name: "Cairo Festival City, Egypt",
    coordinates: "31.4015,30.0254,31.4215,30.0454", // Sample bounding box
  },
  // Add more locations as needed
];

const ActivityCRUD = ({selectedAdverId}) => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); // State to hold categories
  const [advertisers, setAdvertisers] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    price: "",
    category: "",
    advertiser: selectedAdverId,
    tags: "",
    specialDiscount: "",
    isBookingOpen: true,
    rating: 0,
  });
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  // Fetch activities and categories when the component mounts
  useEffect(() => {
    fetchCategories();
    fetchTags();
    // fetchActivitiesByAdver();
  }, [selectedAdverId]);

  const fetchActivitiesByAdver = async () => {
    try {
      const data = await getActivityById({selectedAdverId});

      console.log("Fetched activities:", data);
      console.log('selectedadver = ', selectedAdverId);
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error.response ? error.response.data : error.message);
      setMessage("Failed to fetch activities.", selectedAdverId);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
      console.log('tagss data', data);
    } catch (error) {
      console.error("Error fetching tags", error);
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
  const handleChange = (e, setData) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: selectedLocation,
    }));
  };
  const handleRatingChange = (e) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value))); // Limit rating between 0 and 5
    setFormData(prev => ({
      ...prev,
      rating: isNaN(value) ? 0 : value  // Ensure it's never undefined
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("adverid before creating" , selectedAdverId);
      await createActivity(formData);
      setMessage("Activity created successfully!");
      resetCreateForm();
     fetchActivitiesByAdver();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Error occurred while creating the activity";
      setMessage(errorMessage);
      console.error("Error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateActivity(editData._id, formData); // Send updated formData
      setMessage("Activity updated successfully!");
      resetEditForm();
      fetchActivitiesByAdver();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Error occurred while updating the activity.";
      setMessage(errorMessage);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      setMessage("Activity deleted successfully!");
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error deleting activity.");
      console.error(error);
    }
  };

  const handleEdit = (activity) => {
    setEditData(activity);
    setFormData({ ...activity }); // Set formData to the activity being edited
  };

  const resetCreateForm = () => {
    setFormData({
      date: "",
      time: "",
      location: "",
      price: "",
      category: "",
      advertiser: selectedAdverId,
      tags: "",
      specialDiscount: "",
      isBookingOpen: true,
      rating: 0,
    });
  };

  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm();
  };

  const generateMapSrc = (coordinates) => {
    const [long1, lat1, long2, lat2] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };
  const handleHomeNavigation = () => {
    navigate('/list'); // Adjust this path according to your routing setup
  };

  return (
    <div>
      <h1>Activity Management</h1>
      {message && <p className="message">{message}</p>}

      {/* Form for creating a new activity */}
      <section className="form-section">
        <h2>Create New Activity</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>Rating:
  <input type="range" min="0" max="5" step="0.1" value={formData.rating} onChange={handleRatingChange} />
  <span>{(formData.rating !== undefined ? formData.rating : 0).toFixed(1)}</span> {/* Display the current rating */}
</label>
          <label>
            Time:
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Location:
            <select
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              required
            >
              <option value="">Select Location</option>
              {predefinedLocations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={(e) => handleChange(e, setFormData)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
         
          <label>
            Tags:
            <select
              name="tags"
              value={formData.tags}
              onChange={(e) => handleChange(e, setFormData)}
              required
            >
              <option value="">Select Tags</option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Special Discount (%):
            <input
              type="number"
              name="specialDiscount"
              value={formData.specialDiscount}
              onChange={(e) => handleChange(e, setFormData)}
              required
            />
          </label>
          <label>
            Booking Open:
            <input
              type="checkbox"
              name="isBookingOpen"
              checked={formData.isBookingOpen}
              onChange={(e) => handleChange(e, setFormData)}
            />
          </label>
          <button type="submit">Create Activity</button>
        </form>
      </section>

      {/* List of activities */}
      <section className="activity-list">
        <h2>Activity List</h2>
        {activities.length > 0 ? (
          <ul>
            {activities.map((activity) => {
              const locationData = predefinedLocations.find(
                (location) => location.name === activity.location
              );
              const mapSrc = locationData
                ? generateMapSrc(locationData.coordinates)
                : null;

              return (
                <li key={activity._id} className="activity-item">
                  <h3>{activity.category.name}</h3>
                  <h3>{activity.advertiser.Name}</h3>
                  <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p>Time: {new Date(activity.time).toLocaleTimeString()}</p>
                  <p>Location: {activity.location}</p>
                  <p>Price: ${activity.price}</p>
                  <p>Tags: {activity.tags.name}</p>
                  <p>Rating: {activity.rating}</p>
                  <p>Special Discount: {activity.specialDiscount}%</p>
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
                  <button onClick={() => handleEdit(activity)}>Edit</button>
                  <button onClick={() => handleDelete(activity._id)}>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No activities available.</p>
        )}
      </section>

      {/* Form for editing an activity */}
      {editData && (
        <section className="form-section">
          <h2>Edit Activity</h2>
          <form onSubmit={handleEditSubmit}>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>Rating:
  <input type="range" min="0" max="5" step="0.1" value={formData.rating} onChange={handleRatingChange} />
  <span>{(formData.rating !== undefined ? formData.rating : 0).toFixed(1)}</span> {/* Display the current rating */}
</label>
            <label>
              Location:
              <select
                name="location"
                value={formData.location}
                onChange={handleLocationChange}
                required
              >
                <option value="">Select Location</option>
                {predefinedLocations.map((location) => (
                  <option key={location.name} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>
              Category:
              <select
                name="category"
                value={formData.category}
                onChange={(e) => handleChange(e, setFormData)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
           
            <label>
              Tags:
              <select
                name="tags"
                value={formData.tags}
                onChange={(e) => handleChange(e, setFormData)}
                required
              >
                <option value="">Select Tags</option>
                {tags.map((tags) => (
                  <option key={tags._id} value={tags._id}>
                    {tags.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Special Discount (%):
              <input
                type="number"
                name="specialDiscount"
                value={formData.specialDiscount}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </label>
            <label>
              Booking Open:
              <input
                type="checkbox"
                name="isBookingOpen"
                checked={formData.isBookingOpen}
                onChange={(e) => handleChange(e, setFormData)}
              />
            </label>
            <button type="submit">Update Activity</button>
            <button type="button" onClick={resetEditForm}>
              Cancel
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default ActivityCRUD;
