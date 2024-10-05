import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TourGuidePage = ({selectedTourGuideId}) => {
  const location = useLocation();
  const id = location.state?.id; // Safely retrieve ID from state

  const [tourGuide, setTourGuide] = useState(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Age: '',
    LanguagesSpoken: '',
    MobileNumber: '',
    YearsOfExperience: '',
    PreviousWork: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourGuide = async () => {
      try {
        if (selectedTourGuideId) {
          const response = await axios.get(`http://localhost:8000/TourGuide/users/${selectedTourGuideId}`);
          setTourGuide(response.data);
          setFormData(response.data); // Set initial form data for editing
        } else {
          setError('No Tour Guide ID provided.');
        }
      } catch (err) {
        console.error('Error fetching tour guide:', err);
        setError('Error fetching tour guide data.');
      }
    };

    fetchTourGuide();
  }, [selectedTourGuideId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object without the ID
    const { _selectedTourGuideId, ...updatedData } = formData; // Assuming the ID is in formData

    try {
      const response = await axios.put(`http://localhost:8000/TourGuide/update/${selectedTourGuideId}`, updatedData);
      console.log('Update response:', response.data);
      setTourGuide(response.data); // Update local state with response
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating tour guide:', error.response ? error.response.data : error.message);
      setError('Error updating tour guide.');
    }
  };

  const fetchTourGuideActivities = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/itinerary/readTour?userId=${selectedTourGuideId}`); // Replace with actual API endpoint
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching itineraries', error);
      setError('Failed to fetch itineraries');
    }
  };

  const handleViewTourGuideActivities = () => {
    fetchTourGuideActivities();
  };

  const handleUpdateActivity = (activityId) => {
    navigate(`/update-activity/${activityId}`); // Replace with the actual route for updating an activity
  };

  const handleSchemaTourFrontPage = () => {
    navigate('/SchemaTourFront'); // Replace with the correct route to the schema tour front page
  };

  if (error) return <div>{error}</div>;
  if (!tourGuide) return <div>Loading...</div>;

  return (
    <div>
      <h1>Tour Guide Details and Itineraries</h1>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input name="Name" value={formData.Name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input name="Email" value={formData.Email} onChange={handleChange} required />
          </div>
          <div>
            <label>Age:</label>
            <input name="Age" value={formData.Age} onChange={handleChange} required />
          </div>
          <div>
            <label>Languages Spoken:</label>
            <input name="LanguagesSpoken" value={formData.LanguagesSpoken} onChange={handleChange} required />
          </div>
          <div>
            <label>Mobile Number:</label>
            <input name="MobileNumber" value={formData.MobileNumber} onChange={handleChange} required />
          </div>
          <div>
            <label>Years of Experience:</label>
            <input name="YearsOfExperience" value={formData.YearsOfExperience} onChange={handleChange} required />
          </div>
          <div>
            <label>Previous Work:</label>
            <input name="PreviousWork" value={formData.PreviousWork} onChange={handleChange} />
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <ul>
          <li><strong>Name:</strong> {tourGuide.Name}</li>
          <li><strong>Email:</strong> {tourGuide.Email}</li>
          <li><strong>Age:</strong> {tourGuide.Age}</li>
          <li><strong>Languages Spoken:</strong> {tourGuide.LanguagesSpoken}</li>
          <li><strong>Mobile Number:</strong> {tourGuide.MobileNumber}</li>
          <li><strong>Years of Experience:</strong> {tourGuide.YearsOfExperience}</li>
          <li><strong>Previous Work:</strong> {tourGuide.PreviousWork || 'N/A'}</li>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </ul>
      )}

      <hr />

      <button onClick={handleSchemaTourFrontPage}>
        Create Itinerary
      </button>

      <button onClick={handleViewTourGuideActivities}>
        View My Itineraries
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.name}</h3>
              <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p>Location: {activity.location}</p>
              <p>Price: {activity.price}</p>
              <p>Category: {activity.category}</p>
            </li>
          ))
        ) : (
          <p>No Itineraries found for this tour guide</p>
        )}
      </ul>
    </div>
  );
};

export default TourGuidePage;
