import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#2d3e50",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
  },
  profileContainer: {
    textAlign: "center",
  },
  profileImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "3px solid #fff",
  },
  profileName: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  
  button: {
    margin: '10px',
    padding: '10px 20px', // Reduced padding for smaller buttons
    fontSize: '16px', // Adjusted font size for smaller buttons
    backgroundColor: '#2d3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '180px', // Ensures all buttons have equal width
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    marginLeft: "30px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#2d3e50",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
  },
};

const TourGuidePage = ({ selectedTourGuideId }) => {
  const location = useLocation();
  const id = location.state?.id;

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

  const handleViewTourGuideActivities = () => {
    fetchTourGuideActivities();
  };

  const handleSchemaTourFrontPage = () => {
    navigate('/SchemaTourFront');
  };

  const fetchTourGuideActivities = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/itinerary/readTour?userId=${selectedTourGuideId}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching itineraries', error);
      setError('Failed to fetch itineraries');
    }
  };

  const handleUpdateActivity = (activityId) => {
    navigate(`/update-activity/${activityId}`);
  };

  if (error) return <div>{error}</div>;
  if (!tourGuide) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
          <img src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg" alt="Profile" style={styles.profileImage} />
          <p style={styles.profileName}>{tourGuide.Name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Tour Guide Details and Itineraries</h1>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            {/* ... */}
            <button type="submit" style={styles.button}>Update</button>
            <button type="button" onClick={() => setIsEditing(false)} style={styles.button}>Cancel</button>
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
            <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
          </ul>
        )}

        {/* Navigation Links */}
        <nav style={styles.navbar}>
          <Link to="/Upcoming-activities" style={styles.navLink}>
            Activities
          </Link>
          <Link to="/Upcoming-itineraries" style={styles.navLink}>
            Itineraries
          </Link>
          <Link to="/all-historicalplaces" style={styles.navLink}>
            Historical Places
          </Link>
          <Link to="/all-museums" style={styles.navLink}>
            Museums
          </Link>
        </nav>

        <hr />

        <button onClick={handleSchemaTourFrontPage} style={styles.button}>Create/View Itinerary</button>
      </div>
    </div>
  );
};

export default TourGuidePage;
