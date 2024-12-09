import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Container, Row, Col, Tab, Tabs ,Dropdown, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admin.css';
import img1 from './logoo4.JPG';
import sidebarImage from './logoo444.JPG';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminCapabilities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);  // State to hold total users count
  const [currentMonth, setCurrentMonth] = useState(null);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0); // State for new users this month
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("complaints");

  useEffect(() => {
    fetchComplaints();
    fetchUserStatistics();
  }, []);

  const userData = {
    labels: ['Total Users', `Users in Month ${currentMonth}`],
    datasets: [
      {
        label: 'Number of Users',
        data: [totalUsers, newUsersThisMonth],
        backgroundColor: ['#4B0082', '#007BFF'],
        borderColor: ['#4B0082', '#007BFF'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Statistics',
      },
    },
  };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:8000/complaint/get");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      // Fetch total users (existing request)
      const totalUsersResponse = await axios.get("http://localhost:8000/admin/total-users");
      setTotalUsers(totalUsersResponse.data.totalUsers);

      // Fetch data for the current month's users
      const response = await axios.get("http://localhost:8000/admin/monthly-users");

      // Destructure the response to get currentMonth and totalAcceptedUsersThisMonth
      const { currentMonth, totalAcceptedUsersThisMonth } = response.data;

      // Set the state with the current month and the total number of accepted users
      setCurrentMonth(currentMonth);  // Store the current month (1-12)
      setNewUsersThisMonth(totalAcceptedUsersThisMonth);  // Store the total new users for the current month

    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/resolve/${complaintId}`);
      fetchComplaints(); // Refresh complaints after resolving
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  const handlePasswordChange = async () => {
    const adminId = localStorage.getItem("userId");
    console.log("Admin ID:", adminId); // Log adminId to ensure it's not null or undefined
  
    if (!adminId) {
      alert("Admin ID is missing. Please check.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/admin/update-password/${adminId}`, {
        newPassword,
      });
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  const handleReplyChange = (id, value) => {
    setReplyText({ ...replyText, [id]: value });
  };

  const handleReplySubmit = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/reply/${complaintId}`, {
        reply: replyText[complaintId]
      });
      fetchComplaints(); // Refresh complaints after reply is added
      setReplyText({ ...replyText, [complaintId]: "" }); // Clear reply input
    } catch (error) {
      console.error("Error replying to complaint:", error);
    }
  };

  const filteredAndSortedComplaints = complaints
    .filter((complaint) => statusFilter === "all" || complaint.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px', // Reduced padding for smaller buttons
    fontSize: '16px', // Adjusted font size for smaller buttons
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '180px', // Ensures all buttons have equal width
    textAlign: 'center',
  };

  const handleHover = (e) => {
    e.target.style.backgroundColor = '#0056b3';
    e.target.style.transform = 'scale(1.05)';
  };

  const handleLeave = (e) => {
    e.target.style.backgroundColor = '#007BFF';
    e.target.style.transform = 'scale(1)';
  };

  const handleUpdateClick = () => {
    navigate('/admin-update');
  };

  const adminData = {
    UserName: 'Admin',
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
            {/*<Nav className="me-auto">
              <Nav.Link href="#" className={`home-link ${location.pathname === '/' ? 'selected' : ''}`} onClick={() => navigate("/")}>Home</Nav.Link>
            </Nav>*/}
            <Nav className="ml-auto">
            <Dropdown >
                <Dropdown.Toggle className="drop" id="dropdown-basic">
                  <img src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg" alt="Profile" className="navbar-profile-image" />
                  Admin
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowPasswordChange(true)}>Change Password</Dropdown.Item>
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
    <button className="sidebar-button" onClick={() => navigate("/AddTourismGoverner")}>
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
{showPasswordChange && (
            <div className="password-change-container">
              <h2>Change Password</h2>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              {passwordChanged && <p>Password changed successfully!</p>}
            </div>
          )}
  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="admin-tabs">
    <Tab eventKey="complaints" title="Complaints">
      <div className="filter-sort-container">
        <label>Filter by Status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>

        <label>Sort by Date: </label>
        <button className='sort-button' onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </button>
      </div>
      <div className="complaints-container">
        {filteredAndSortedComplaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <div className="complaint-header">
              <img src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-company-employee-avatar-icon-wearing-a-necktie-png-image_8537621.png" alt="User" className="complaint-profile-image" />
              <div>
                <h3>{complaint.title}</h3>
                <p>{new Date(complaint.date).toLocaleDateString()}</p>
              </div>
            </div>
            <p>{complaint.body}</p>
            <div className="action-buttons">
              {complaint.status === "pending" && (
                <button className="resolve-button" onClick={() => handleResolveComplaint(complaint._id)}>Resolve</button>
              )}
              <div className="reply-section">
                <input
                  type="text"
                  placeholder="Reply here..."
                  value={replyText[complaint._id] || ""}
                  onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                  className="reply-input"
                />
                <button className="reply-button" onClick={() => handleReplySubmit(complaint._id)}>Send Reply</button>
                {complaint.reply && <p className="reply-text">Admin Reply: {complaint.reply}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Tab>
    <Tab eventKey="manage-users" title="User Statistics">
      <div>
        <div>
          <Bar data={userData} options={options} />
        </div>
      </div>
    </Tab>
  </Tabs>
 </div>

        {/* Right Sidebar */}
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
};

export default AdminCapabilities;