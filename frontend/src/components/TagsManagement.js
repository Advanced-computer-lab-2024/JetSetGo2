import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'

const TagsManagement = () => {
  const [preferances, setPreferances] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/prefTags/readtag');
      setPreferances(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };


  useEffect(() => {
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editId) {
           await axios.put(`http://localhost:8000/prefTags/updateTagId/${editId}`, { ...formData });

        } else {
            await axios.post('http://localhost:8000/prefTags/createtag', {
                ...formData,
            });
        }
        fetchTags();
        setFormData({
            name: '',
        });
        setEditId(null);
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};


  const handleEdit = (prefTags) => {
    setFormData(prefTags);
    setEditId(prefTags._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/prefTags/deletetag/${id}`);
      fetchTags();
    } catch (error) {
      console.error('Error deleting Tags:', error);
    }
  };

  return (
    <div>
      <h1>Virtual Trip Planner</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Tour Name" required />
        <button type="submit">{editId ? 'Update Itinerary' : 'Create Itinerary'}</button>
      </form>

      <h2>Tags</h2>
      <ul>
    {preferances.map((prefTags) => (
        <li key={prefTags._id}>
            <h3>{prefTags.name}</h3>
            <button onClick={() => handleEdit(prefTags)}>Edit</button>
            <button onClick={() => handleDelete(prefTags._id)}>Delete</button>
        </li>
    ))}
</ul>

    </div>
  );
};

export default TagsManagement;
