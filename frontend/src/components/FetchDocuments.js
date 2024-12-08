import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';


const OthersListPage = () => {
  const [sellers, setSellers] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const sellerResponse = await fetch("http://localhost:8000/Seller/get");
        const adverResponse = await fetch(
          "http://localhost:8000/home/adver/get"
        );
        const tourGuideResponse = await fetch(
          "http://localhost:8000/TourGuide/get"
        );

        if (!sellerResponse.ok || !adverResponse.ok || !tourGuideResponse.ok) {
          throw new Error("Failed to fetch data from one or more sources");
        }

        const sellers = await sellerResponse.json();
        const advertisers = await adverResponse.json();
        const tourGuides = await tourGuideResponse.json();

        setSellers(sellers);
        setAdvertisers(advertisers);
        setTourGuides(tourGuides);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch("http://localhost:8000/Seller/get");
      if (!response.ok) {
        throw new Error("Failed to fetch sellers");
      }
      const sellers = await response.json();
      setSellers(sellers); // assuming you have setSellers as a state hook for sellers
    } catch (err) {
      setError(err.message);
    }
  };
  
  const fetchAdvertisers = async () => {
    try {
      const response = await fetch("http://localhost:8000/home/adver/get");
      if (!response.ok) {
        throw new Error("Failed to fetch advertisers");
      }
      const advertisers = await response.json();
      setAdvertisers(advertisers); // assuming you have setAdvertisers as a state hook for advertisers
    } catch (err) {
      setError(err.message);
    }
  };
  
  const fetchTourGuides = async () => {
    try {
      const response = await fetch("http://localhost:8000/TourGuide/get");
      if (!response.ok) {
        throw new Error("Failed to fetch tour guides");
      }
      const tourGuides = await response.json();
      setTourGuides(tourGuides); // assuming you have setTourGuides as a state hook for tour guides
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Updated handler functions
  const handleAcceptSeller = async (sellerId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Seller/acceptSeller/${sellerId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept seller");
      }
      await fetchSellers(); // Refresh the sellers list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleRejectSeller = async (sellerId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Seller/rejectSeller/${sellerId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject seller");
      }
      await fetchSellers(); // Refresh the sellers list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleAcceptAdver = async (adverId) => {
    
    try {
      const response = await fetch(
        `http://localhost:8000/home/adver/acceptAdver/${adverId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept advertiser");
      }
      await fetchAdvertisers(); // Refresh the advertisers list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleRejectAdver = async (adverId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/home/adver/rejectAdver/${adverId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject advertiser");
      }
      await fetchAdvertisers(); // Refresh the advertisers list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleAcceptTourGuide = async (tourGuideId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/TourGuide/acceptTourguide/${tourGuideId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept tour guide");
      }
      await fetchTourGuides(); // Refresh the tour guides list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleRejectTourGuide = async (tourGuideId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/TourGuide/rejectTourguide/${tourGuideId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject tour guide");
      }
      await fetchTourGuides(); // Refresh the tour guides list
    } catch (err) {
      setError(err.message);
    }
  };
  
  const renderSellerTable = (users, title, handleAccept, handleReject) => {
    if (!users.length) return null;

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
            {/*<Nav className="me-auto">
              <Nav.Link href="#" className={`home-link ${location.pathname === '/' ? 'selected' : ''}`} onClick={() => navigate("/")}>Home</Nav.Link>
            </Nav>*/}
            <Nav className="ml-auto">
            <Dropdown alignRight>
  <Dropdown.Toggle className="drop">
    <img src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg" alt="Profile" className="navbar-profile-image" />
    Admin
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item onClick={() => navigate("/login")}>Logout</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="admin-container">

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
    <button className="sidebar-button" onClick={() => navigate("/login")}>
      <i className="fas fa-sign-out-alt"></i> Logout
    </button>
    
  </div>

  <div className="main-content">
  <h2 className="section-title">{title}</h2>
  <table className="styled-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>ID Document</th>
        <th>Taxation Registry Card</th>
        <th>Actions</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>
            <div className="user-info">
              <img
                src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
                alt="Profile"
                className="profile-image"
              />
              {user.UserName || "N/A"}
            </div>
          </td>
          <td>{user.Email || "N/A"}</td>
          <td>
            {user.IDDocument ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.IDDocument}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View ID Document
              </a>
            ) : (
              "No document"
            )}
          </td>
          <td>
            {user.TaxationRegistryCard ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.TaxationRegistryCard}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Taxation Registry Card
              </a>
            ) : (
              "No taxation registry card"
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null && (
              <>
                <button
                  onClick={() => handleAcceptSeller(user._id)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectSeller(user._id)}
                  className="reject-button"
                >
                  Reject
                </button>
              </>
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null
              ? "Not Reviewed Yet"
              : user.Admin_Acceptance
              ? "Accepted"
              : "Rejected"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
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

      </div>
    );
  };

  const renderTourGuideTable = (users) => {
    if (!users.length) return null;

    return (
      <div className="admin-page">
        
        <div className="admin-container">
          {/* Sidebar */}
          <div className="sidebar">
            
            <div className="sidebar-image-container">
              <img src={sidebarImage} alt="Sidebar Image" className="sidebar-image" />
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
  <h2 className="section-title">Tour Guides</h2>
  <table className="styled-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>ID Document</th>
        <th>Certificates</th>
        <th>Actions</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>
            <div className="user-info">
              <img
                src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
                alt="Profile"
                className="profile-image"
              />
              {user.UserName || "N/A"}
            </div>
          </td>
          <td>{user.Email || "N/A"}</td>
          <td>
            {user.IDDocument ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.IDDocument}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View ID Document
              </a>
            ) : (
              "No document"
            )}
          </td>
          <td>
            {user.Certificates ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.Certificates}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificates
              </a>
            ) : (
              "No certificates"
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null && (
              <>
                <button
                  onClick={() => handleAcceptTourGuide(user._id)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectTourGuide(user._id)}
                  className="reject-button"
                >
                  Reject
                </button>
              </>
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null
              ? "Not Reviewed Yet"
              : user.Admin_Acceptance
              ? "Accepted"
              : "Rejected"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className="right-sidebar">
  <div className="sidebar-buttons">
    </div>
</div>
        </div>
      </div>
    );
  };


  const renderAdverTable = (users, title, handleAccept, handleReject) => {
    if (!users.length) return null;

    return (
      <div className="admin-page">

        <div className="admin-container">
          {/* Sidebar */}
          <div className="sidebar">
            
          </div>

          {/* Main Content */}
          <div className="main-content">
  
  <h2 className="section-title">{title}</h2>
  <table className="styled-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>ID Document</th>
        <th>Taxation Registry Card</th>
        <th>Actions</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>
            <div className="user-info">
              <img
                src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png"
                alt="Profile"
                className="profile-image"
              />
              {user.UserName || "N/A"}
            </div>
          </td>
          <td>{user.Email || "N/A"}</td>
          <td>
            {user.IDDocument ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.IDDocument}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View ID Document
              </a>
            ) : (
              "No document"
            )}
          </td>
          <td>
            {user.TaxationRegistryCard ? (
              <a
                href={`http://localhost:8000/uploads/documents/${user.TaxationRegistryCard}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Taxation Registry Card
              </a>
            ) : (
              "No taxation registry card"
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null && (
              <>
                <button
                  onClick={() => handleAcceptAdver(user._id)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectAdver(user._id)}
                  className="reject-button"
                >
                  Reject
                </button>
              </>
            )}
          </td>
          <td>
            {user.Admin_Acceptance === null
              ? "Not Reviewed Yet"
              : user.Admin_Acceptance
              ? "Accepted"
              : "Rejected"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className="right-sidebar">
  <div className="sidebar-buttons">
    
  </div>
</div>
        </div>
      </div>
    );
};


  const renderContent = () => {
    if (loading) {
      return <p style={styles.loading}>Loading...</p>;
    }

    if (error) {
      return <p style={styles.error}>{error}</p>;
    }

    return (
      <div style={styles.content}>
        {renderSellerTable(
          sellers,
          "Sellers",
          handleAcceptSeller,
          handleRejectSeller
        )}
        {renderAdverTable(
          advertisers,
          "Advertisers",
          handleAcceptAdver,
          handleRejectAdver
        )}
        {renderTourGuideTable(tourGuides)}
      </div>
    );
  };

  return (
    <div >
      {renderContent()}
    </div>
  );
};

const styles = {
  
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  sectionContainer: {
    marginBottom: "40px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "8px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#4A90E2",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableData: {
    padding: "10px",
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    marginRight: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#888",
  },
  error: {
    color: "#f44336",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  content: {
    padding: "20px",
  },
};

export default OthersListPage;
