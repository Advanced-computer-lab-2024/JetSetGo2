import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Tab,
  Tabs,
  Dropdown,
  
} from "react-bootstrap";
import "./admin.css";
import img1 from "./logoo4.JPG";
import sidebarImage from "./logoo444.JPG";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SalesReportPage = () => {
  const navigate = useNavigate();
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    productName: "",
    specificDate: "",
    specificMonth: "",
  });

  const fetchSalesReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8000/SalesReport/generate",
        null,
        { params: filters }
      );
      setSalesReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    navigate("/login"); // Redirect to the login page
  };


  const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
              <Dropdown>
                <Dropdown.Toggle className="drop" id="dropdown-basic">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg"
                    alt="Profile"
                    className="navbar-profile-image"
                  />
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

      <div className="sidebar">
          <button
            className="sidebar-button"
            onClick={() => navigate("/adminCapabilities")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/fetchdocuments")}
          >
            <i className="fas fa-users"></i> View Users
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/AddAdmin")}
          >
            <i className="fas fa-user-plus"></i> Add An Admin
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/DeleteUsers")}
          >
            <i className="fas fa-user-cog"></i> Manage Users
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/AddTourismGoverner")}
          >
            <i className="fas fa-user-tie"></i> Tourism Governer
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/Sales-Report")}
          >
            <i className="fas fa-tachometer-alt"></i> Sales Report
          </button>
          <button className="sidebar-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <div className="sidebar-image-container">
            <img
              src={sidebarImage}
              alt="Sidebar Image"
              className="sidebar-image"
            />
          </div>
        </div>

        <div className="main-content">


      <h2>Sales Report</h2>

      {/* Filters */}
      <Form className="mb-4">
        <Form.Group controlId="productName">
          <Form.Label>Filter by Product Name</Form.Label>
          <Form.Control
            type="text"
            name="productName"
            value={filters.productName}
            onChange={handleFilterChange}
            placeholder="Enter product name"
          />
        </Form.Group>

        <Form.Group controlId="specificDate">
          <Form.Label>Filter by Specific Date</Form.Label>
          <Form.Control
            type="date"
            name="specificDate"
            value={filters.specificDate}
            onChange={handleFilterChange}
          />
        </Form.Group>

        <Form.Group controlId="specificMonth">
          <Form.Label>Filter by Specific Month</Form.Label>
          <Form.Control
            type="month"
            name="specificMonth"
            value={filters.specificMonth}
            onChange={handleFilterChange}
          />
        </Form.Group>
      </Form>

      {/* Fetch Button */}
      <div x>
        <Button className="resolve-button" onClick={fetchSalesReport} variant="primary" >
          {"Generate Sales Report"}
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Report Card */}
      {salesReport && (
        <Card>
          <Card.Header>
            <h5>Sales Report</h5>
          </Card.Header>
          <Card.Body>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Revenue Source</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Activity Revenue</td>
                  <td>{formatCurrency(salesReport.activityRevenue)}</td>
                </tr>
                <tr>
                  <td>Itinerary Revenue</td>
                  <td>{formatCurrency(salesReport.itineraryRevenue)}</td>
                </tr>
                <tr>
                  <td>Gift Shop Revenue</td>
                  <td>{formatCurrency(salesReport.giftShopRevenue)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Revenue</strong>
                  </td>
                  <td>
                    <strong>{formatCurrency(salesReport.totalRevenue)}</strong>
                  </td>
                </tr>
                <tr>
                  <td>App Fee (10%)</td>
                  <td>{formatCurrency(salesReport.appFee)}</td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>
      )}

      {/* Loading Spinner */}
      {loading && <Spinner animation="border" role="status" className="mt-3" />}

      </div>

      {/* Right Sidebar */}
        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            <button className="box" onClick={() => navigate("/category")}>
              Categories
            </button>
            <button className="box" onClick={() => navigate("/TagsManagement")}>
              Tags
            </button>
            <button className="box" onClick={() => navigate("/product")}>
              Products
            </button>
            <button
              className="box"
              onClick={() => navigate("/activitiesAdmin")}
            >
              Activities
            </button>
            <button
              className="box"
              onClick={() => navigate("/ItinerariesAdmin")}
            >
              Itineraries
            </button>
            <button className="box" onClick={() => navigate("/MuseumsAdmin")}>
              Museums
            </button>
            <button
              className="box"
              onClick={() => navigate("/HistoricalPlacesAdmin")}
            >
              Historical Places
            </button>
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

export default SalesReportPage;
