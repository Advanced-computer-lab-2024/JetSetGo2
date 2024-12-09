import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import sidebarImage from './logoo444.JPG';
import "./TourGuidePage.css"; // Import the CSS file
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import img1 from './logoo4.JPG';
import { FaPen } from "react-icons/fa"; 

const SchemaTourFront = () => {
  const userId = localStorage.getItem("userId");
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [Tags, setTags] = useState([]);
  const [activeTab, setActiveTab] = useState("Details");
  const [tourGuide, setTourGuide] = useState(null);
  const [isEditing, setIsEditing] = useState(false);



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
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    navigate("/login"); // Redirect to the login page
  };
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/TourGuide/deletMyAccount/${userId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };

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
    
    <div className="tour-guide-page">
      <Navbar className="navbar">
      <Container>
        
        <Navbar.Brand href="#" className="navbar-brand">
          {/* Replace with your logo */}
          <img src={img1} alt="Logo" className="navbar-logo" />
        </Navbar.Brand>
      </Container>
    </Navbar>
    <div className="admin-container">
    <div className="sidebar">
  <div className="profile-container">
    
    <button className="sidebar-button" onClick={handleLogout}>
      Logout
    </button>
    <button onClick={handleDeleteAccount} className="sidebar-button">
      Delete Account
    </button>
    <button className="sidebar-button" onClick={handleBackClick}>
      Back
    </button>
  </div>
  <div className="sidebar-image-container">
    <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
  </div>
</div>

    
    
        
      
        <div className="main-content">

        <Tabs
  activeKey={activeTab}
  onSelect={(tab) => setActiveTab(tab)}
  className="admin-tabs"
>
  {/* Create Itinerary Tab */}
  <Tab eventKey="createItinerary" title="Create Itinerary">
    <div className="form-container">
      <h2>Create Itinerary</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tour Name</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter tour name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Activity</Form.Label>
          <Form.Select
            value={formData.selectedActivity}
            onChange={(e) => handleChange(e)}
            required
          >
            <option value="">Select an activity</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.date} - {activity.location}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Select
            value={formData.Tags}
            onChange={(e) => handleTagsChange(e)}
            required
          >
            <option value="">Select Tag</option>
            {Tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Range
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleRatingChange}
          />
          <span>{(formData.rating !== undefined ? formData.rating : 0).toFixed(1)}</span>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Is Active"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Locations</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="locations"
            value={formData.locations}
            onChange={handleChange}
            placeholder="Enter locations"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Timeline</Form.Label>
          <Form.Control
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="Enter timeline"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Duration (hours)</Form.Label>
          <Form.Control
            type="number"
            name="durationActivity"
            value={formData.durationActivity}
            onChange={handleChange}
            placeholder="Enter duration in hours"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Language</Form.Label>
          <Form.Control
            name="tourLanguage"
            value={formData.tourLanguage}
            onChange={handleChange}
            placeholder="Enter language"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="TourPrice"
            value={formData.TourPrice}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Available Dates</Form.Label>
          <Form.Control
            type="date"
            name="availableDates"
            value={formData.availableDates}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Accessibility</Form.Label>
          <Form.Control
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
            placeholder="Enter accessibility details"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pick Up Location</Form.Label>
          <Form.Control
            name="pickUpLoc"
            value={formData.pickUpLoc}
            onChange={handleChange}
            placeholder="Enter pick-up location"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Drop Off Location</Form.Label>
          <Form.Control
            name="DropOffLoc"
            value={formData.DropOffLoc}
            onChange={handleChange}
            placeholder="Enter drop-off location"
            required
          />
        </Form.Group>

        <Button className="reply-button" type="submit">
          {editId ? 'Update Itinerary' : 'Create Itinerary'}
        </Button>
      </Form>
    </div>
  </Tab>


  <Tab eventKey="viewItineraries" title="View Itineraries">
  <div className="itineraries-container">
    <ul className="itineraries-list">
      {itineraries.map((itinerary) => (
        <li key={itinerary._id} className="itinerary-card">
          <div className="itinerary-details">
            <h3 className="itinerary-title">{itinerary.name}</h3>
            <p><strong>Activities:</strong> {itinerary.activities.map((activity) =>
              `${activity.date} - ${activity.time} - ${activity.location} - ${activity.price} - ${activity.category.name} - ${activity.specialDiscount}`
            ).join(', ')}</p>
            <p><strong>Tags:</strong> {itinerary.Tags.name}</p>
            <p><strong>Locations:</strong> {itinerary.locations.join(', ')}</p>
            <p><strong>Timeline:</strong> {itinerary.timeline}</p>
            <p><strong>Duration:</strong> {itinerary.durationActivity} hours</p>
            <p><strong>Language:</strong> {itinerary.tourLanguage}</p>
            <p><strong>Price:</strong> ${itinerary.TourPrice}</p>
            <p><strong>Rating:</strong> {itinerary.rating}</p>
            <p><strong>Date:</strong> {itinerary.availableDates}</p>
            <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
            <p><strong>Pick Up Location:</strong> {itinerary.pickUpLoc}</p>
            <p><strong>Drop Off Location:</strong> {itinerary.DropOffLoc}</p>
            <p><strong>Active:</strong> {itinerary.isActive ? "Yes" : "No"}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => handleEdit(itinerary)}
              className="reply-button"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(itinerary._id)}
              className="reply-button"
            >
              Delete
            </button>
          </div>
          {/* If editing this itinerary, show edit fields */}
          {editId === itinerary._id && (
            <div >
              <h4>Edit Itinerary</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tour Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter tour name"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Select Activity</Form.Label>
                  <Form.Select
                    name="selectedActivity"
                    value={formData.selectedActivity}
                    onChange={handleChange}
                    required
                  >


                    <option value="">Select an activity</option>
                    {activities.map((activity) => (
                      <option key={activity._id} value={activity._id}>
                        {activity.date} - {activity.location}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Select
                    name="Tags"
                    value={formData.Tags}
                    onChange={handleTagsChange}
                    required
                  >
                    <option value="">Select Tag</option>
                    {Tags.map((tag) => (
                      <option key={tag._id} value={tag._id}>
                        {tag.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Timeline</Form.Label>
                  <Form.Control
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    placeholder="Enter timeline"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (hours)</Form.Label>
                  <Form.Control
                    name="durationActivity"
                    type="number"
                    value={formData.durationActivity}
                    onChange={handleChange}
                    placeholder="Enter duration"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    name="TourPrice"
                    type="number"
                    value={formData.TourPrice}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                  />
                </Form.Group>
                <Button type="submit" style={{ marginRight: '10px' }}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
</Tab>

      </Tabs>
      </div>
      {/* Right Sidebar */}
<div className="right-sidebar">
  <div className="sidebar-buttons">
    <button className="box" onClick={() => navigate("/SchemaTourFront")}>Create Itinerary</button>
  </div>
</div>
      </div>
      {/* Footer */}
      <div className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>Contact Us</h5>
              <p>Email: contact@jetsetgo.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Travel Road</p>
              <p>Adventure City, World 45678</p>
            </Col>
            <Col md={4}>
              <h5>Follow Us</h5>
              <p>Facebook | Twitter | Instagram</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SchemaTourFront;
