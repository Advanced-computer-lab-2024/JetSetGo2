import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const TouristHome = ({ selectedTouristId }) => {
  const [touristData, setTouristData] = useState({
    UserName: "",
    wallet: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    MuseumsOrHistoricalPlace: [],
    activities: [],
  });
  const [searchMethod, setSearchMethod] = useState("name"); // State for search method
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/getTourist/${selectedTouristId}`
        );
        setTouristData(response.data);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };

    if (selectedTouristId) {
      fetchTouristData();
    }
  }, [selectedTouristId]);

  // Function to handle search input and set results
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/search?searchword=${encodeURIComponent(
          searchQuery
        )}&searchType=${searchMethod}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults({
        MuseumsOrHistoricalPlace: [],
        activities: [],
      });
    }
  };

  const handleUpdateClick = () => {
    navigate("/tourist-update");
  };

  const handleSearchMethodChange = (e) => {
    setSearchMethod(e.target.value); // Update search method based on dropdown selection
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!touristData) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Loading tourist data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Tourist Profile Section */}
      <div style={styles.profileContainer}>
        <div style={styles.profileHeader}>
          <img
            src="https://via.placeholder.com/60"
            alt="Profile"
            style={styles.profileImage}
          />
          <h1 style={styles.profileName}>{touristData.UserName}</h1>
        </div>
        <p style={styles.walletText}>Wallet Balance: ${touristData.wallet}</p>
        <button onClick={handleUpdateClick} style={styles.button}>
          Update Profile
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.contentContainer}>
        <h2 style={styles.contentHeader}>Welcome to Your Dashboard</h2>

        {/* Search Bar Section */}
        <div style={styles.searchContainer}>
          <select
            onChange={handleSearchMethodChange}
            value={searchMethod}
            style={styles.dropdown}
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="tags">Tags</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search..."
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            Search
          </button>
        </div>

        {/* Navbar Section */}
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

        {/* Search Results Section */}
        <div style={styles.resultsContainer}>
          <h3>Search Results:</h3>
          {Array.isArray(searchResults.MuseumsOrHistoricalPlace) &&
          Array.isArray(searchResults.activities) &&
          (searchResults.MuseumsOrHistoricalPlace.length > 0 ||
            searchResults.activities.length > 0) ? (
            <ul style={styles.resultsList}>
              {searchResults.MuseumsOrHistoricalPlace.map((place, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>{place.name}</h4>
                  <p>{place.description}</p>
                  <p>Location: {place.location}</p>
                  <p>Opening Hours: {place.openingHours}</p>
                  <p>Ticket Price: ${place.ticketPrice}</p>
                </li>
              ))}
              {searchResults.activities.map((activity, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>{activity.name}</h4>
                  <p>Date: {activity.date}</p>
                  <p>Time: {activity.time}</p>
                  <p>Location: {activity.location}</p>
                  <p>Price: ${activity.price}</p>
                  <p>Special Discount: ${activity.specialDiscount}</p>
                  <p>Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Add your styles here
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    backgroundColor: "#f4f4f4", // Light background color for better contrast
  },
  profileContainer: {
    width: "250px",
    marginRight: "20px",
    backgroundColor: "#fff", // White background for the profile container
    padding: "15px",
    borderRadius: "10px", // Rounded corners for a modern look
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  profileImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  profileName: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  walletText: {
    marginTop: "10px",
    fontSize: "18px",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#ff6348", // Tomato color for the button
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Transition for hover effect
  },
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    width: "100%", // Full width
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Shadow for search container
    backgroundColor: "#fff", // White background
    padding: "10px", // Padding around the search elements
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
    fontSize: "16px",
    backgroundColor: "#f9f9f9", // Light background for input
    transition: "border-color 0.3s ease", // Transition for border on focus
  },
  dropdown: {
    marginRight: "10px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#f9f9f9", // Light background for dropdown
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#333",
    padding: "1rem 2rem",
    marginBottom: "20px", // Space between navbar and search results
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
  },
  resultsContainer: {
    backgroundColor: "#fff", // White background for results container
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Shadow for depth
  },
  resultsList: {
    listStyleType: "none",
    padding: 0,
  },
  resultItem: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9", // Light background for each result item
    borderRadius: "5px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Shadow for depth on result items
  },
};

export default TouristHome;
