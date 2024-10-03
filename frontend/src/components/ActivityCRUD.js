import React, { useState, useEffect } from 'react';
import '../App.css';
import { getActivity, createActivity, updateActivity, deleteActivity, getCategories } from '../services/ActivityService'; // Make sure to import the new getCategories function

const ActivityCRUD = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]); // State to hold categories
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    price: '',
    category: '', // Make sure to set the category to an ObjectId
    tags: '',
    specialDiscount: '',
    isBookingOpen: true
  });
  const [editData, setEditData] = useState(null);

  // Fetch activities and categories when the component mounts
  useEffect(() => {
    fetchActivities();
    fetchCategories(); // Fetch categories from backend
  }, []);

  // Fetch all activities
  const fetchActivities = async () => {
    try {
      const data = await getActivity();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories(); // Assume this function fetches categories
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Handle form input change
  const handleChange = (e, setData) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission for creating a new activity
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createActivity(formData);
      setMessage('Activity created successfully!');
      resetCreateForm();
      fetchActivities();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while creating the activity';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing activity
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return;

    try {
      await updateActivity(editData._id, editData);
      setMessage('Activity updated successfully!');
      resetEditForm();
      fetchActivities();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Error occurred while updating the activity.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle activity deletion
  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      setMessage('Activity deleted successfully!');
      fetchActivities();
    } catch (error) {
      setMessage('Error deleting activity.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (activity) => {
    setEditData(activity);
  };

  // Reset form for creating
  const resetCreateForm = () => {
    setFormData({
      date: '',
      time: '',
      location: '',
      price: '',
      category: '', // Reset to empty string
      tags: '',
      specialDiscount: '',
      isBookingOpen: true
    });
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
  };

  return (
    <div>
      <h1>Activity Management</h1>

      {message && <p className="message">{message}</p>}

      {/* Form for creating a new activity */}
      <section className="form-section">
        <h2>Create New Activity</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>Date:
            <input type="date" name="date" value={formData.date} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Time:
            <input type="time" name="time" value={formData.time} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Location:
            <input type="text" name="location" value={formData.location} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Price:
            <input type="number" name="price" value={formData.price} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Category:
            <select name="category" value={formData.category} onChange={(e) => handleChange(e, setFormData)} required>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>Tags:
            <input type="text" name="tags" value={formData.tags} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Special Discount (%):
            <input type="number" name="specialDiscount" value={formData.specialDiscount} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <label>Booking Open:
            <input type="checkbox" name="isBookingOpen" checked={formData.isBookingOpen} onChange={(e) => handleChange(e, setFormData)} />
          </label>
          <button type="submit">Create Activity</button>
        </form>
      </section>

      {/* Form for editing an existing activity */}
      {editData && (
        <section className="form-section">
          <h2>Edit Activity</h2>
          <form onSubmit={handleEditSubmit}>
            <label>Date:
              <input type="date" name="date" value={editData.date} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Time:
              <input type="time" name="time" value={editData.time} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Location:
              <input type="text" name="location" value={editData.location} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Price:
              <input type="number" name="price" value={editData.price} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Category:
              <select name="category" value={editData.category} onChange={(e) => handleChange(e, setEditData)} required>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </label>
            <label>Tags:
              <input type="text" name="tags" value={editData.tags} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Special Discount (%):
              <input type="number" name="specialDiscount" value={editData.specialDiscount} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <label>Booking Open:
              <input type="checkbox" name="isBookingOpen" checked={editData.isBookingOpen} onChange={(e) => handleChange(e, setEditData)} />
            </label>
            <button type="submit">Update Activity</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}

      {/* List of activities */}
      <section className="activity-list">
        <h2>Activity List</h2>
        {activities.length > 0 ? (
          <ul>
            {activities.map((activity) => (
              <li key={activity._id} className="activity-item">
                <h3>{activity.category.name}</h3> {/* Displaying category name */}
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p>Time: {new Date(activity.time).toLocaleTimeString()}</p>
                <p>Location: {activity.location}</p>
                <p>Price: ${activity.price}</p>
                <p>Tags: {activity.tags}</p>
                <p>Special Discount: {activity.specialDiscount}%</p>
                <p>Booking Open: {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                <button onClick={() => handleEdit(activity)}>Edit</button>
                <button onClick={() => handleDelete(activity._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities available.</p>
        )}
      </section>
    </div>
  );
};

export default ActivityCRUD;

