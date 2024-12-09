import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importing external libraries for enhanced design
import { Button, Card, ProgressBar } from "react-bootstrap";  // Optional: If you're using React Bootstrap

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
      action: () => navigate("/upcoming-activitiest"),
    },
    {
      title: "Step 5: Explore Itineraries",
      description: "Discover pre-planned itineraries by clicking the 'Itineraries' button.",
      action: () => navigate("/upcoming-itinerariest"),
    },
    {
      title: "Step 6: Visit Historical Places and Museums",
      description: "Check out historical places and museums using the 'Historical Places' and 'Museums' links.",
      action: () => navigate("/HPT"),
    },
    {
      title: "Step 7: Book Transportation",
      description: "Arrange transportation for your vacation by clicking the 'Book Transportation' button.",
      action: () => navigate("/transportationBooking"),
    },
    {
      title: "Step 8: Shop for Products",
      description: "Explore the marketplace by clicking the 'View Products' button for souvenirs or other vacation essentials.",
      action: () => navigate("/p"),
    },
    {
      title: "Step 9: File Complaints",
      description: "If you encounter any issues, use the 'File a Complaint' button to report your concerns.",
      action: () => navigate("/file-complaint"),
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentGuide = steps[currentStep];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{currentGuide.title}</h2>
      <p style={styles.description}>{currentGuide.description}</p>
      
      <Card style={styles.card}>
        <button
          onClick={currentGuide.action}
          style={styles.actionButton}
        >
          Go to Step
        </button>
      </Card>
      
      <div style={styles.paginationContainer}>
        <Button 
          onClick={handleBack}
          disabled={currentStep === 0}
          style={{ ...styles.button, backgroundColor: currentStep === 0 ? "#ccc" : "#5bc0de" }}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          style={{ ...styles.button, backgroundColor: currentStep === steps.length - 1 ? "#ccc" : "#5bc0de" }}
        >
          Next
        </Button>
      </div>

      <ProgressBar
        now={((currentStep + 1) / steps.length) * 100}
        label={`${currentStep + 1} of ${steps.length}`}
        style={styles.progressBar}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f7fc",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    margin: "auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  card: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  actionButtonHover: {
    backgroundColor: "#45a049",
  },
  paginationContainer: {
    marginTop: "30px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin: "0 10px",
  },
  progressBar: {
    marginTop: "30px",
    height: "20px",
  },
};

export default TouristGuide;
