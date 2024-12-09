import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/tourist.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Tab,
  Tabs,
  Dropdown,
  Form,
  Button,
} from "react-bootstrap";
import img1 from "./logoo4.JPG";

const TouristHome = () => {
  const predefinedLocations = [
    { name: "Cairo, Egypt", coordinates: "31.2357,30.0444,31.2557,30.0644" },
    {
      name: "Giza Pyramids, Egypt",
      coordinates: "31.1313,29.9765,31.1513,29.9965",
    },
    {
      name: "Alexandria, Egypt",
      coordinates: "29.9097,31.2156,29.9297,31.2356",
    },
    {
      name: "German University in Cairo, Egypt",
      coordinates: "31.4486,29.9869,31.4686,30.0069",
    },
    {
      name: "Cairo Festival City, Egypt",
      coordinates: "31.4015,30.0254,31.4215,30.0454",
    },
  ];
  const [bookedFlights, setBookedFlights] = useState([]);
  const [bookedHotels, setBookedHotels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [points, setPoints] = useState(0);
  const [Wallet, setWallet] = useState(0);
  const [message, setMessage] = useState(""); // For success/error messages

  const [touristData, setTouristData] = useState({
    UserName: "",
    Loyalty_Level: 0,
    Loyalty_Points: 0,
    Wallet: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    Museums: [],
    HistoricalPlace: [],
    activities: [],
    itinaries: [],
  });
  const [searchMethod, setSearchMethod] = useState("name");
  const navigate = useNavigate();

  const touristId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/getTourist/${touristId}`
        );
        setTouristData(response.data);
        setWallet(response.data.Wallet); // Set wallet initially from fetched data
        setPoints(response.data.Loyalty_Points);
        console.log("Tourist data response:", response.data);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
      }
    };
    const fetchBookedFlights = async (touristId) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/bookedFlights/${touristId}`
        );
        console.log("Booked flights:", response.data);
        setBookedFlights(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching booked flights:", error);
      }
    };

    const fetchBookedHotels = async (touristId) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/home/tourist/bookedHotels/${touristId}`
        );
        console.log("Booked hotels:", response.data);
        setBookedHotels(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching booked hotels:", error);
      }
    };
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/complaint/complaints/${touristId}`
        );
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    if (touristId) {
      fetchTouristData();
      fetchBookedFlights(touristId);
      fetchBookedHotels(touristId);
      fetchComplaints();
    }
  }, [touristId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Debugging: Log search query and method
    console.log("Searching for:", searchQuery, "Method:", searchMethod);

    try {
      const response = await axios.get(
        `http://localhost:8000/search?searchword=${encodeURIComponent(
          searchQuery
        )}&searchType=${searchMethod}`
      );
      console.log("Search Results:", response.data); // Log results for debugging
      setSearchResults(response.data);
      console.log("datata = ", response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults({
        Museums: [],
        HistoricalPlace: [],
        activities: [],
        itinaries: [],
      });
    }
  };

  const handleRedeemPoints = async () => {
    if (points <= 0) {
      setMessage("You don't have enough points to redeem.");
      return;
    }

    try {
      // Make the PUT request to redeem points
      const response = await axios.put(
        `http://localhost:8000/home/tourist/redeempoints/${touristId}`
      );

      // Update the state with the response data (wallet balance and remaining points)
      setMessage(response.data.message);
      // setTouristData((prevData) => ({
      //   ...prevData,
      //   wallet: response.data.wallet,
      //   Loyalty_Points: response.data.loyaltyPointsRemaining,
      // }));
      setWallet(response.data.wallet);
      setPoints(response.data.loyaltyPointsRemaining);
      setTouristData((prevData) => ({
        ...prevData,
        wallet: response.data.wallet, // Update touristData wallet
        Loyalty_Points: response.data.loyaltyPointsRemaining, // Update touristData points
      }));
    } catch (error) {
      console.error("Error redeeming points:", error);
      setMessage("Error redeeming points, please try again.");
    }
  };

  const handleUpdateClick = () => {
    navigate("/tourist-update");
  };

  const handleSearchMethodChange = (e) => {
    setSearchMethod(e.target.value);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const generateMapSrc = (coordinates) => {
    const [long1, lat1] = coordinates.split(",");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates}&layer=mapnik&marker=${lat1},${long1}`;
  };

  const findLocationMap = (name) => {
    const location = predefinedLocations.find((loc) => loc.name === name);
    return location ? generateMapSrc(location.coordinates) : null;
  };

  // if (!touristData) {
  //   return (
  //     <div style={styles.container}>
  //       <p style={styles.errorText}>Loading tourist data...</p>
  //     </div>
  //   );
  // }
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/home/tourist/deletMyAccount/${touristId}`
        );

        if (response.status === 200) {
          alert(response.data.message); // Display success message
          navigate("/login"); // Redirect to homepage or login after deletion
        }
      } catch (error) {
        // Handle errors, such as when there are upcoming booked itineraries
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Display error message from backend
        } else {
          alert("An error occurred while deleting the account.");
        }
      }
    }
  };
  const loyaltyImages = {
    1: "https://readingbydesign.org/sites/default/files/badges/champ_level01.png",
    2: "https://readingbydesign.org/sites/default/files/badges/champ_level02.png",
    3: "https://readingbydesign.org/sites/default/files/badges/champ_level03.png",
    // Add more levels as needed
  };
  const getLoyaltyImage = () => {
    // Fallback image if level is undefined or no matching level found
    return (
      loyaltyImages[touristData.Loyalty_Level] ||
      "https://readingbydesign.org/sites/default/files/badges/champ_level01.png"
    );
  };
  return (
    <div className="tourist-page">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand
            href="#"
            style={{
              transform: "translateX(-140px)",
              paddingLeft: "0",
              marginLeft: "0",
            }}
          >
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {/* Cart Icon */}
              <Nav.Link href="#" onClick={() => navigate("/cart")}>
                <i
                  className="fas fa-shopping-cart"
                  style={{ fontSize: "20px" }}
                ></i>
              </Nav.Link>

              {/* Wishlist Icon */}
              <Nav.Link href="#" onClick={() => navigate("/wishlist")}>
                <i className="fas fa-heart" style={{ fontSize: "20px" }}></i>
              </Nav.Link>

              {/* Notification Bell Icon */}
              <Nav.Link href="#" onClick={() => navigate("/notifications")}>
                <i className="fas fa-bell" style={{ fontSize: "20px" }}></i>
              </Nav.Link>

              {/* Tourist Dropdown */}
              <Nav.Link className="profile-nav">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/007/522/917/non_2x/boss-administrator-businessman-avatar-profile-icon-illustration-vector.jpg"
                  alt="Profile"
                  className="navbar-profile-image"
                />
              </Nav.Link>
              <Nav.Link>
                <span className="navbar-profile-name">
                  {touristData.UserName}
                </span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="tourist-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="loyalty-section">
            <div className="loyalty-container">
              <img
                src={getLoyaltyImage()}
                alt="Loyalty Level"
                className="loyalty-image"
              />
              <p className="wallet-text">
                Loyalty Level: {touristData.Loyalty_Level}
              </p>
            </div>
            <div className="wallet-details">
              <p className="wallet-text">Loyalty Points: {points}</p>
              <p className="wallet-text">Wallet: $ {touristData.Wallet}</p>
            </div>
          </div>
          <div className="button-container">
            <button className="sidebar-button" onClick={handleRedeemPoints}>
              <i className="fas fa-gift"></i> Redeem Points
            </button>
            <button className="sidebar-button" onClick={handleUpdateClick}>
              <i className="fas fa-user-edit"></i> Update Profile
            </button>
            <button className="sidebar-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
            <button className="sidebar-button" onClick={handleDeleteAccount}>
              <i className="fas fa-trash-alt"></i> Delete Account
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="search-bar-container">
            <select
              onChange={handleSearchMethodChange}
              value={searchMethod}
              className="search-dropdown"
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
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          {/* Tabs for navigation */}
          <Tabs defaultActiveKey="overview" className="main-content-tabs">
            <Tab eventKey="overview" title="My Booked Flights">
              <div className="tab-content"></div>
              {bookedFlights.length > 0 ? (
                <ul className="booked-flights-list">
                  {bookedFlights.map((flight, index) => (
                    <li key={index} className="flight-item">
                      <h4>Flight Details</h4>
                      <p>
                        <strong>Flight Number:</strong> {flight.id}
                      </p>
                      <p>
                        <strong>Departure:</strong>{" "}
                        {
                          flight.itineraries?.[0].segments?.[0].departure
                            .iataCode
                        }
                      </p>
                      <p>
                        <strong>Arrival:</strong>{" "}
                        {flight.itineraries?.[0].segments?.[0].arrival.iataCode}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {flight.itineraries?.[0].segments?.[0].departure.at}
                      </p>
                      <p>
                        <strong>Price:</strong> {flight.price.currency}{" "}
                        {flight.price.total}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-flights-text">You have no booked flights.</p>
              )}
            </Tab>
            <Tab eventKey="details" title="My Booked Hotels">
              <div className="tab-content">
                {bookedHotels.length > 0 ? (
                  <ul className="booked-hotels-list">
                    {bookedHotels.map((hotel, index) => (
                      <li key={index} className="hotel-item">
                        <p>
                          <strong>Hotel Name:</strong> {hotel.hotelName}
                        </p>
                        <p>
                          <strong>Check In Date:</strong>{" "}
                          {hotel.offer.checkInDate}
                        </p>
                        <p>
                          <strong>Check Out Date:</strong>{" "}
                          {hotel.offer.checkOutDate}
                        </p>
                        <p>
                          <strong>Guests:</strong> {hotel.offer.guests.adults}
                        </p>
                        <p>
                          <strong>Price:</strong> {hotel.offer.price.currency}{" "}
                          {hotel.offer.price.total}
                        </p>
                        <p>
                          <strong>Room:</strong> {hotel.offer.room.type}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-hotels-text">You have no booked Hotels.</p>
                )}
              </div>
            </Tab>
            <Tab eventKey="settings" title="My Complains">
              <div className="tab-content">
                {complaints.length > 0 ? (
                  <ul className="complaints-list">
                    {complaints.map((complaint, index) => (
                      <li key={index} className="complaint-item">
                        <p>
                          <strong>Title:</strong> {complaint.title}
                        </p>
                        <p>
                          <strong>Body:</strong> {complaint.body}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(complaint.date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {complaint.status}
                        </p>
                        {complaint.reply && (
                          <p>
                            <strong>Reply:</strong> {complaint.reply}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-complaints-text">No complaints found.</p>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <div className="sidebar-buttons">
            <button className="box" onClick={() => navigate("/flight-search")}>
              Book Flight
            </button>
            <button className="box" onClick={() => navigate("/hotelSearch")}>
              Book Hotel
            </button>
            <button
              className="box"
              onClick={() =>
                navigate("/upcoming-itinerariest", {
                  state: { touristId: touristId },
                })
              }
            >
              Itineraries
            </button>
            <button
              className="box"
              onClick={() =>
                navigate("/upcoming-activitiest", {
                  state: { touristId: touristId },
                })
              }
            >
              Activities
            </button>
            <button className="box" onClick={() => navigate("/museusemst")}>
              Museums
            </button>
            <button className="box" onClick={() => navigate("/HPT")}>
              Historical Places
            </button>
            <button
              className="box"
              onClick={() => navigate("/transportationBooking")}
            >
              Book Transport
            </button>
            <button className="box" onClick={() => navigate("/p")}>
              Buy Products
            </button>
            <button className="box" onClick={() => navigate("/file-complaint")}>
              File a complain
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
              <p>Email: support@touristplatform.com</p>
              <p>Phone: +123 456 7890</p>
            </Col>
            <Col md={4}>
              <h5>Address</h5>
              <p>123 Explore Lane</p>
              <p>Adventure City, ExploreWorld 12345</p>
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
export default TouristHome;
