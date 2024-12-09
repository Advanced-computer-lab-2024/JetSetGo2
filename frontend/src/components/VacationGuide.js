import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, Button, ProgressBar, Card } from "react-bootstrap";
import sidebarImage from "./logoo444.JPG";
import img1 from "./logoo4.JPG";
import "../css/TouristGuide.css";

const TouristGuide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Step 1: Select Your Preferences",
      description: "Start by selecting your preferences for the vacation, such as historic areas, beaches, family-friendly options, shopping, etc.",
      action: () => navigate("/Select-Perefrence"),
    },
    {
      title: "Step 2: Search for Flights",
      description: "Search for flights using the 'Search Flights' button to plan your travel dates.",
      action: () => navigate("/flight-search"),
    },
    {
      title: "Step 3: Search for Hotels",
      description: "Find accommodations using the 'Search Hotels' button for your preferred location and dates.",
      action: () => navigate("/hotelSearch"),
    },
    {
      title: "Step 4: Browse Activities",
      description: "Explore upcoming activities using the 'Activities' button to plan your vacation itinerary.",
      action: () => navigate("/upcoming-activities"),
    },
    {
      title: "Step 5: Explore Itineraries",
      description: "Discover pre-planned itineraries by clicking the 'Itineraries' button.",
      action: () => navigate("/upcoming-itineraries"),
    },
    {
      title: "Step 6: Visit Historical Places and Museums",
      description: "Check out historical places and museums using the 'Historical Places' and 'Museums' links.",
      action: () => navigate("/historical-places"),
    },
    {
      title: "Step 7: Book Transportation",
      description: "Arrange transportation for your vacation by clicking the 'Book Transportation' button.",
      action: () => navigate("/transportationBooking"),
    },
    {
      title: "Step 8: Shop for Products",
      description: "Explore the marketplace by clicking the 'View Products' button for souvenirs or other vacation essentials.",
      action: () => navigate("/products"),
    },
    {
      title: "Step 9: File Complaints",
      description: "If you encounter any issues, use the 'File a Complaint' button to report your concerns.",
      action: () => navigate("/file-complaint"),
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentGuide = steps[currentStep];

  return (
    <div className="tour-guide-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#" className="navbar-brand">
            <img src={img1} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ml-auto">
          
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="admin-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="profile-container">
            <button className="sidebar-button" onClick={() => navigate(-1)}>Back</button>
          </div>
          <div className="sidebar-image-container">
            <img src={sidebarImage} alt="Sidebar" className="sidebar-image" />
          </div>
        </div>

        {/* Stepper Content */}
        <div className="main-content">
          <h2 className="guide-title">{currentGuide.title}</h2>
          <p className="guide-description">{currentGuide.description}</p>

          <Card className="guide-card">
            <Button
              className="action-button"
              onClick={currentGuide.action}
            >
              Go to Step
            </Button>
          </Card>

          <div >
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`reply-button ${currentStep === 0 ? "disabled" : ""}`}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`reply-button ${currentStep === steps.length - 1 ? "disabled" : ""}`}
            >
              Next
            </Button>
          </div>

          <ProgressBar
            now={((currentStep + 1) / steps.length) * 100}
            label={`${currentStep + 1} of ${steps.length}`}
            className="progress-bar"
          />
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

export default TouristGuide;