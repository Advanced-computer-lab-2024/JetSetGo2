import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#2d3e50",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff6348',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

const SchemaTourFront = () => {
  const userId = localStorage.getItem("userId");
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [Tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    selectedActivity: '',
    timeline: '',
    durationActivity: '',
    tourLanguage: '',
    TourPrice: '',
    availableDates: '',
    accessibility: '',
    pickUpLoc: '',
    DropOffLoc: '',
    tourGuide: '',
    Tags: '',
    rating: 0,
    isActive: false, // Add isActive
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      console.log(userId);
      const response = await axios.get(`http://localhost:8000/itinerary/readTourId?userId=${userId}`);
      setItineraries(response.data);
      console.log('Itineraries:', response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/category/get`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/activity/get');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/prefTags/readtag');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching Tags:', error);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchActivities();
    fetchTags();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e) => {
    const value = Math.max(0, Math.min(5, Number(e.target.value)));
    setFormData(prev => ({
      ...prev,
      rating: isNaN(value) ? 0 : value
    }));
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back
  };

  const handleActivityChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, selectedActivity: value }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, Tags: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      activities: [formData.selectedActivity],
      Tags: [formData.Tags],
      tourGuide: userId,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:8000/itinerary/updateTourId/${editId}`, payload);
      } else {
        await axios.post('http://localhost:8000/itinerary/createtour', payload);
      }
      fetchItineraries();
      setFormData({
        name: '',
        selectedActivity: '',
        timeline: '',
        durationActivity: '',
        tourLanguage: '',
        TourPrice: '',
        availableDates: '',
        accessibility: '',
        pickUpLoc: '',
        DropOffLoc: '',
        tourGuide: userId,
        Tags: '',
        rating: 0,
        isActive: false, // Add isActive
      });
      setEditId(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (itinerary) => {
    setFormData(itinerary);
    setEditId(itinerary._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/itinerary/deleteTour/${id}`);
      fetchItineraries();
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fa', padding: '20px' }}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>Sidebar</h2>
        <button onClick={handleBackClick} style={styles.backButton}>
          Go Back
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>
          Create Itenerary
        </h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Tour Name" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          
          <label>Select Activity:</label>
          <select value={formData.selectedActivity} onChange={handleActivityChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
            <option value="">Select an Activity</option>
            {activities.map(activity => (
              <option key={activity._id} value={activity._id}>
                {activity.date} - {activity.time} - {activity.location} - {activity.price} - {activity.specialDiscount} - {activity.isBookingOpen ? "Booking Open" : "Booking Closed"}
              </option>
            ))}
          </select>

          <label>Tags:</label>
          <select name="Tags" value={formData.Tags} onChange={handleTagsChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
            <option value="">Select Tag</option>
            {Tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>

          <label>Rating:</label>
          <input type="range" min="0" max="5" step="0.1" value={formData.rating} onChange={handleRatingChange} style={{ marginBottom: '10px' }} />
          <span>{(formData.rating !== undefined ? formData.rating : 0).toFixed(1)}</span>
          <label>
    <input
      type="checkbox"
      name="isActive"
      checked={formData.isActive}
      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
    />
    Is Active
  </label>

          <textarea name="locations" value={formData.locations} onChange={handleChange} placeholder="Locations" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Timeline" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="durationActivity" type="number" value={formData.durationActivity} onChange={handleChange} placeholder="Duration (hours)" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="tourLanguage" value={formData.tourLanguage} onChange={handleChange} placeholder="Language" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="TourPrice" type="number" value={formData.TourPrice} onChange={handleChange} placeholder="Price" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="availableDates" type="date" value={formData.availableDates} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="accessibility" value={formData.accessibility} onChange={handleChange} placeholder="Accessibility" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="pickUpLoc" value={formData.pickUpLoc} onChange={handleChange} placeholder="Pick Up Location" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input name="DropOffLoc" value={formData.DropOffLoc} onChange={handleChange} placeholder="Drop Off Location" required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />

          <button type="submit" style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
            {editId ? 'Update Itinerary' : 'Create Itinerary'}
          </button>
        </form>

        <h2>Itineraries</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id} style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <strong>{itinerary.name}</strong><br />
                <p>Activities: 
                  {itinerary.activities.map(activity => 
                    `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price} - ${activity.category.name} - ${activity.specialDiscount}`
                  ).join(', ')}
                </p>
                <p>Tags: {itinerary.Tags.name}</p>
                <p>Locations: {itinerary.locations.join(', ')}</p>
                <p>Timeline: {itinerary.timeline}</p>
                <p>Duration: {itinerary.durationActivity} hours</p>
                <p>Language: {itinerary.tourLanguage}</p>
                <p>Price: {itinerary.TourPrice} </p>
                <p>Rating: {itinerary.rating} </p>
                <p>Date: {itinerary.availableDates}</p>
                <p>Accessibility: {itinerary.accessibility}</p>
                <p>Pick Up Location: {itinerary.pickUpLoc}</p>
                <p>Drop Off Location: {itinerary.DropOffLoc}</p>
                <p>Active: {itinerary.isActive ? "Yes" : "No"}</p>

              </div>
              <div>
                <button onClick={() => handleEdit(itinerary)} style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}>Edit</button>
                <button onClick={() => handleDelete(itinerary._id)} style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchemaTourFront;
