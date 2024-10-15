import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
} from "../services/ActivityService";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ActivityCRUD = ({ selectedAdverId }) => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "", // This will hold latitude and longitude as a string
    price: "",
    category: "",
    advertiser: selectedAdverId,
    tags: "",
    specialDiscount: "",
    isBookingOpen: true,
    rating: 0,
  });
  const [pinPosition, setPinPosition] = useState([30.0444, 31.2357]); // Default to Cairo, Egypt
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchActivitiesByAdver();
  }, [selectedAdverId]);

  const fetchActivitiesByAdver = async () => {
    try {
      const data = await getActivityById({ selectedAdverId });
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setMessage("Failed to fetch activities.");
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    const newActivity = { ...formData, location: locationString };
    try {
      await createActivity(newActivity);
      setMessage("Activity created successfully!");
      resetCreateForm();
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error occurred while creating the activity.");
      console.error("Error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    const locationString = `${pinPosition[0]},${pinPosition[1]}`; // Save lat, long as a string
    const updatedActivity = { ...formData, location: locationString };
    try {
      await updateActivity(editData._id, updatedActivity);
      setMessage("Activity updated successfully!");
      resetEditForm();
      fetchActivitiesByAdver();
    } catch (error) {
      setMessage("Error occurred while updating the activity.");
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
    setFormData({ ...activity });
    const [lat, lon] = activity.location.split(',').map(Number);
    setPinPosition([lat, lon]); // Set the map pin to the activity's location
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
    setPinPosition([30.0444, 31.2357]); // Reset map pin to default location (Cairo)
  };

  const resetEditForm = () => {
    setEditData(null);
    resetCreateForm();
  };

  const handleHomeNavigation = () => {
    navigate('/list'); // Adjust this path according to your routing setup
  };

  const handleRatingChange = (e) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value)));
    setFormData((prev) => ({
      ...prev,
      rating: isNaN(value) ? 0 : value,
    }));
  };

  // Component for handling map clicks and updating the pin position
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPinPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return pinPosition ? <Marker position={pinPosition}></Marker> : null;
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h1>Activity Management</h1>
      {message && <p className="message">{message}</p>}

      {/* Home Button */}
      <button onClick={handleHomeNavigation} className="home-button">
        Home
      </button>

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

          {/* Map for selecting location */}
          <label>Location: (Click on the map to place the pin)</label>
          <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
            <MapContainer center={pinPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
          </div>

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
            Special Discount:
            <input
              type="number"
              name="specialDiscount"
              value={formData.specialDiscount}
              onChange={(e) => handleChange(e, setFormData)}
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
          <label>
            Rating (0-5):
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
            />
          </label>
          <button type="submit">Create Activity</button>
        </form>
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

            {/* Map for editing location */}
            <label>Location: (Click on the map to change pin position)</label>
            <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
              <MapContainer center={pinPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>

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
              Special Discount:
              <input
                type="number"
                name="specialDiscount"
                value={formData.specialDiscount}
                onChange={(e) => handleChange(e, setFormData)}
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
            <label>
              Rating (0-5):
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
              />
            </label>
            <button type="submit">Update Activity</button>
          </form>
          <button onClick={resetEditForm}>Cancel Edit</button>
        </section>
      )}

<section className="activity-list" style={{ marginTop: '20px' }}>
  <h2>Activity List</h2>
  {activities.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {activities.map((activity) => {
        const locationCoords = activity.location.split(",");
        const latitude = locationCoords[0];
        const longitude = locationCoords[1];
        const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;

        const category = categories.find(cat => cat._id === activity.category);
        const categoryName = category ? category.name : "Unknown Category";

        const tag = tags.find(t => t._id === activity.tags);
        const tagName = tag ? tag.name : "Unknown Tag";

        return (
          <div
            key={activity._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            {/* Activity details */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '1.5em', color: '#333' }}>
                {categoryName}
              </h3>
              <h4>Advertiser: {activity.advertiser.Name}</h4>
              <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(activity.time).toLocaleTimeString()}</p>
              <p><strong>Location:</strong> {activity.location}</p>
              <p><strong>Price:</strong> ${activity.price}</p>
              <p><strong>Rating:</strong> {activity.rating.toFixed(1)} / 5</p>
              <p><strong>Tags:</strong> {tagName}</p>
              <p><strong>Special Discount:</strong> {activity.specialDiscount}%</p>
              <p><strong>Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}</p>
              <button
                onClick={() => handleEdit(activity)}
                style={{
                  marginRight: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(activity._id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>

            {/* Embedded map showing the location with the pin */}
            <div style={{ flexShrink: 0, width: '300px', height: '200px', borderRadius: '5px', overflow: 'hidden' }}>
              <iframe
                src={mapSrc}
                width="300"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Activity Location"
              ></iframe>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>No activities found.</p>
  )}
</section>

    </div>
  );
};

export default ActivityCRUD;
