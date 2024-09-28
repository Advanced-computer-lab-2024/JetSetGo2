
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemaTourFront = () => {
  const [itineraries, setItineraries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    activities: '',
    locations: '',
    timeline: '',
    durationActivity: '',
    tourLanguage: '',
    TourPrice: '',
    availableDates: '',
    accessibility: '',
    pickUpLoc: '',
    DropOffLoc: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/itinerary/readTour');
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        
        await axios.put(`http://localhost:8000/itinerary/updateTourId`, { id: editId, ...formData });
      } else {
        
        await axios.post('http://localhost:8000/itinerary/createtour', formData);
      }
      fetchItineraries();
      setFormData({
        name: '',
        activities: '',
        locations: '',
        timeline: '',
        durationActivity: '',
        tourLanguage: '',
        TourPrice: '',
        availableDates: '',
        accessibility: '',
        pickUpLoc: '',
        DropOffLoc: '',
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
      await axios.delete('http://localhost:8000/itinerary/deleteTour', { data: { id } });
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
        <textarea name="activities" value={formData.activities} onChange={handleChange} placeholder="Activities" required />
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
            <p>Activities: {itinerary.activities.join(', ')}</p>
            <p>Locations: {itinerary.locations.join(', ')}</p>
            <button onClick={() => handleEdit(itinerary)}>Edit</button>
            <button onClick={() => handleDelete(itinerary._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SchemaTourFront;