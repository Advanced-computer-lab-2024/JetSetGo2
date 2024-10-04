import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'

const SchemaTourFront = ({selectedTourGuideId}) => {
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]); // State to hold activities
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
  });
  const [editId, setEditId] = useState(null);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/itinerary/readTour?userId=${selectedTourGuideId}`);
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/activity/get'); // Adjust this path to your activities endpoint
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchActivities(); // Fetch activities on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, selectedActivity: value })); // Update selected activity
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Tour Guide ID:', selectedTourGuideId);
    
    const payload = {
        ...formData,
        activities: [formData.selectedActivity], // Ensure you're sending the selected activity ID in an array
        tourGuide: selectedTourGuideId, // Include tourGuide in the payload
    };

    console.log('Payload:', payload); // Log the payload being sent

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
            locations: '',
            timeline: '',
            durationActivity: '',
            tourLanguage: '',
            TourPrice: '',
            availableDates: '',
            accessibility: '',
            pickUpLoc: '',
            DropOffLoc: '',
            tourGuide: selectedTourGuideId,
        });
        setEditId(null);
    } catch (error) {
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
    <div>
      <h1>Virtual Trip Planner</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Tour Name" required />
        
        {/* Single Activity Dropdown */}
        <label>Select Activity:</label>
        <select value={formData.selectedActivity} onChange={handleActivityChange} required>
          <option value="">Select an Activity</option> {/* Placeholder option */}
          {activities.map(activity => (
            <option key={activity._id} value={activity._id}>
              {activity.date} - {activity.time} - {activity.location} - {activity.price} - {activity.category.name} - {activity.specialDiscount} - {activity.isBookingOpen ? "Booking Open" : "Booking Closed"}
            </option>
          ))}
        </select>

        <textarea name="locations" value={formData.locations} onChange={handleChange} placeholder="Locations" required />
        <input name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Timeline" required />
        <input name="durationActivity" type="number" value={formData.durationActivity} onChange={handleChange} placeholder="Duration (hours)" required />
        <input name="tourLanguage" value={formData.tourLanguage} onChange={handleChange} placeholder="Language" required />
        <input name="TourPrice" type="number" value={formData.TourPrice} onChange={handleChange} placeholder="Price" required />
        <input name="availableDates" type="date" value={formData.availableDates} onChange={handleChange} placeholder="Available Date" required />
        <input name="accessibility" value={formData.accessibility} onChange={handleChange} placeholder="Accessibility" required />
        <input name="pickUpLoc" value={formData.pickUpLoc} onChange={handleChange} placeholder="Pick Up Location" required />
        <input name="DropOffLoc" value={formData.DropOffLoc} onChange={handleChange} placeholder="Drop Off Location" required />
        <button type="submit">{editId ? 'Update Itinerary' : 'Create Itinerary'}</button>
      </form>

      <h2>Itineraries</h2>
      <ul>
    {itineraries.map((itinerary) => (
        <li key={itinerary._id}>
            <h3>{itinerary.name}</h3>
            {/* Ensure you access the populated activity details correctly */}
            <p>Activities: 
                {itinerary.activities.map(activity => 
                    `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price} - ${activity.category} - ${activity.specialDiscount}`
                ).join(', ')}
            </p>
            <p>Locations: {itinerary.locations.join(', ')}</p>
            <p>Timeline: {itinerary.timeline.join(', ')}</p>
            <p>Duration: {itinerary.durationActivity.join(', ')} hours</p>
            <p>Language: {itinerary.tourLanguage.join(', ')}</p>
            <p>Price: {itinerary.TourPrice.join(', ')} </p>
            <p>Date: {itinerary.availableDates.join(', ')}</p>
            <p>Accessibility: {itinerary.accessibility.join(', ')}</p>
            <p>Pick Up Location: {itinerary.pickUpLoc.join(', ')}</p>
            <p>Drop Off Location: {itinerary.DropOffLoc.join(', ')}</p>
            <button onClick={() => handleEdit(itinerary)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id)}>Delete</button>
        </li>
    ))}
</ul>

    </div>
  );
};

export default SchemaTourFront;
