import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { deleteTourGuide } from '../services/TGuideService';
import { deleteAdver } from '../services/AdverService';
import { deleteSeller } from '../services/SellerService';
import { deleteTourist } from '../services/TouristService';
import { Navbar, Nav, Container, Row, Col, Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import '@fortawesome/fontawesome-free/css/all.min.css';

const TourGuideComponent = () => {
    const navigate = useNavigate();
    const [tourGuides, setTourGuides] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [message, setMessage] = useState('');

    const fetchTourGuides = async () => {
        try {
            const response = await fetch('http://localhost:8000/TourGuide/get');
            const data = await response.json();
            setTourGuides(data);
            console.log("Tour Guides:", data);
        } catch (error) {
            console.error("Error fetching Tour Guides:", error);
            setMessage('Error fetching Tour Guide list.');
        }
    };

    const fetchAdvertisers = async () => {
        try {
            const response = await fetch('http://localhost:8000/home/adver/get');
            const data = await response.json();
            setAdvertisers(data);
            console.log("Advertisers:", data);
        } catch (error) {
            console.error("Error fetching Advertisers:", error);
            setMessage('Error fetching Advertiser list.');
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await fetch('http://localhost:8000/Seller/get');
            const data = await response.json();
            setSellers(data);
            console.log("Sellers:", data);
        } catch (error) {
            console.error("Error fetching Sellers:", error);
            setMessage('Error fetching Seller list.');
        }
    };

    const fetchTourists = async () => {
        try {
            const response = await fetch('http://localhost:8000/home/tourist/get');
            const data = await response.json();
            setTourists(data);
            console.log("Tourists:", data);
        } catch (error) {
            console.error("Error fetching Tourists:", error);
            setMessage('Error fetching Tourist list.');
        }
    };

    const handleDeleteTourGuide = async (id) => {
        try {
            await deleteTourGuide(id);
            setMessage('Tour Guide deleted successfully!');
            fetchTourGuides();
        } catch (error) {
            setMessage('Error deleting Tour Guide. Please try again.');
            console.error("Error deleting Tour Guide:", error);
        }
    };

    const handleDeleteAdver = async (id) => {
        try {
            await deleteAdver(id);
            setMessage('Advertiser deleted successfully!');
            fetchAdvertisers();
        } catch (error) {
            setMessage('Error deleting Advertiser. Please try again.');
            console.error("Error deleting Advertiser:", error);
        }
    };

    const handleDeleteSeller = async (id) => {
        try {
            await deleteSeller(id);
            setMessage('Seller deleted successfully!');
            fetchSellers();
        } catch (error) {
            setMessage('Error deleting Seller. Please try again.');
            console.error("Error deleting Seller:", error);
        }
    };

    const handleLogout = () => {
        // Clear user session or token if needed
        localStorage.removeItem('userToken'); // Example: remove token from localStorage
        navigate('/login'); // Redirect to the login page
      };

    const handleDeleteTourist = async (id) => {
        try {
            await deleteTourist(id);
            setMessage('Tourist deleted successfully!');
            fetchTourists();
        } catch (error) {
            setMessage('Error deleting Tourist. Please try again.');
            console.error("Error deleting Tourist:", error);
        }
    };

    useEffect(() => {
        fetchTourGuides();
        fetchAdvertisers();
        fetchSellers();
        fetchTourists();
    }, []);

    // Button styles for admin navigation
    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        //backgroundColor: '#2d3e50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s',
        width: '180px',
        textAlign: 'center',
    };

    const handleHover = (e) => {
        e.target.style.backgroundColor = '#0056b3';
        e.target.style.transform = 'scale(1.05)';
    };

    const handleLeave = (e) => {
        e.target.style.backgroundColor = '#ffffff';
        e.target.style.transform = 'scale(1)';
    };

    return (
        <div className="admin-page">
  {/* Navbar */}
  <Navbar className="navbar">
    <Container>
      <Navbar.Brand href="#">
        <img src={img1} alt="Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Dropdown alignRight>
            <Dropdown.Toggle className="drop">
              <img src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg" alt="Profile" className="navbar-profile-image" />
              Admin
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>

  <div className="admin-container">
    {/* Sidebar */}
    <div className="sidebar">
      <button className="sidebar-button" onClick={() => navigate("/adminCapabilities")}>
        <i className="fas fa-tachometer-alt"></i> Dashboard
      </button>
      <button className="sidebar-button" onClick={() => navigate("/fetchdocuments")}>
        <i className="fas fa-users"></i> View Users
      </button>
      <button className="sidebar-button" onClick={() => navigate("/AddAdmin")}>
        <i className="fas fa-user-plus"></i> Add An Admin
      </button>
      <button className="sidebar-button" onClick={() => navigate("/DeleteUsers")}>
        <i className="fas fa-user-cog"></i> Manage Users
      </button>
      <button className="sidebar-button" onClick={() => navigate("/AddTourismGovernor")}>
        <i className="fas fa-user-tie"></i> Tourism Governer
      </button>
      <button className="sidebar-button" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
      <div className="sidebar-image-container">
        <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
      </div>
    </div>

    {/* Main Content */}
    <div className="main-content">
      <h2 className="section-title">Manage All Users</h2>
      {message && <div className="alert alert-success">{message}</div>}

      {/* Tour Guide Box */}
<div className="user-box">
  <h3 className="list-title">Tour Guide List</h3>
  <ul className="user-list">
    {tourGuides.map((guide) => (
      <li key={guide._id} className="list-item">
        <div className="user-info">
          <img
            src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
            alt="Profile"
            className="profile-image"
          />
          <span>{guide.UserName}</span>
        </div>
        <button
          className="list-button"
          onClick={() => handleDeleteTourGuide(guide._id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>

      {/* Advertiser Box */}
<div className="user-box">
  <h3 className="list-title">Advertiser List</h3>
  <ul className="user-list">
    {advertisers.map((adver) => (
      <li key={adver._id} className="list-item">
        <div className="user-info">
          <img
            src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
            alt="Profile"
            className="profile-image"
          />
          <span>{adver.UserName}</span>
        </div>
        <button
          className="list-button"
          onClick={() => handleDeleteAdver(adver._id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>

     {/* Seller Box */}
<div className="user-box">
  <h3 className="list-title">Seller List</h3>
  <ul className="user-list">
    {sellers.map((seller) => (
      <li key={seller._id} className="list-item">
        <div className="user-info">
          <img
            src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
            alt="Profile"
            className="profile-image"
          />
          <span>{seller.UserName}</span>
        </div>
        <button
          className="list-button"
          onClick={() => handleDeleteSeller(seller._id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>

      {/* Tourist Box */}
      <div className="user-box">
  <h3 className="list-title">Tourist List</h3>
  <ul className="user-list">
    {tourists.map((tourist) => (
      <li key={tourist._id} className="list-item">
        <div className="user-info">
          <img
            src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
            alt="Profile"
            className="profile-image"
          />
          <span>{tourist.UserName}</span>
        </div>
        <button
          className="list-button"
          onClick={() => handleDeleteTourist(tourist._id)}
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>
    </div>

    {/* Right Sidebar */}
    <div className="right-sidebar">
      <div className="sidebar-buttons">
        <button className="box" onClick={() => navigate("/category")}>Categories</button>
        <button className="box" onClick={() => navigate("/TagsManagement")}>Tags</button>
        <button className="box" onClick={() => navigate("/product")}>Products</button>
        <button className="box" onClick={() => navigate("/activitiesAdmin")}>Activities</button>
        <button className="box" onClick={() => navigate("/ItinerariesAdmin")}>Itineraries</button>
        <button className="box" onClick={() => navigate("/MuseumsAdmin")}>Museums</button>
        <button className="box" onClick={() => navigate("/HistoricalPlacesAdmin")}>Historical Places</button>
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
}

const styles = {
    container: {
        display: 'flex',
    },
    sidebar: {
        width: '250px',
        //backgroundColor: '#2d3e50',
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
    },
    profileContainer: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    profileImage: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
    profileName: {
        margin: '10px 0',
    },
    button: {
        marginTop: '10px',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    mainContent: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        marginLeft: '20px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
    },
    header: {
        marginBottom: '20px',
        fontSize: '24px',
    },
    message: {
        color: 'green',
        marginBottom: '20px',
    },
    userBox: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    listTitle: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    userList: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    listButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    listButtonHover: {
        backgroundColor: '#c82333',
    },
};


export default TourGuideComponent;
