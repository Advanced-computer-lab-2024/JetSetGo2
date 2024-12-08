import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
  const handleFlightSearchClick = () => {
    navigate("/flight-search"); // Redirect to the Flight Search page
  };

  const handleHotelSearchClick = () => {
    navigate("/hotelSearch"); // Redirect to the Flight Search page
  };

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

  if (!touristData) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Loading tourist data...</p>
      </div>
    );
  }
  const handleFileComplaintClick = () => {
    navigate("/file-complaint", { state: { touristId } });
  };
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
return loyaltyImages[touristData.Loyalty_Level] || "https://readingbydesign.org/sites/default/files/badges/champ_level01.png";
};


  return (
    <div style={styles.container}>
      {/* Tourist Profile Section */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            style={styles.profileImage}
          />
          <h2 style={styles.profileName}>{touristData.UserName}</h2>
          <p style={styles.walletText}>
            Loyalty Level: {touristData.Loyalty_Level}
          </p>
          <p style={styles.walletText}>Loyalty Points: {points}</p>
          <p style={styles.walletText}>Wallet: $ {Wallet}</p>{" "}
          {/* Display updated wallet */}
          
          <img
            src={getLoyaltyImage()}
            alt="Loyalty Level"
            style={styles.loyaltyImage}
          />
          <button onClick={handleUpdateClick} style={styles.button}>
            Update Profile
          </button>
          <button onClick={handleRedeemPoints} style={styles.redeemButton}>
            Redeem All Points
          </button>
          {message && <p>{message}</p>}
          <button
            onClick={() => navigate("/mi", { state: { touristId: touristId } })}
          >
            My Itenaries
          </button>
          <button
            onClick={() =>
              navigate("/myactivity", { state: { touristId: touristId } })
            }
          >
            My Activities
          </button>
          <button
            onClick={() =>
              navigate("/myhp", { state: { touristId: touristId } })
            }
          >
            My HistoricalPlaces
          </button>
          <button
            onClick={() =>
              navigate("/mymp", { state: { touristId: touristId } })
            }
          >
            My Museums
          </button>
          <button
  onClick={() => navigate("/my-orders")}
  style={{
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  My Orders
</button>

          <button
            onClick={handleDeleteAccount}
            style={{
              color: "red",
              background: "lightgrey",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            Delete Account
          </button>
<button
  onClick={() => navigate("/cart")}
  style={{
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  View My Cart
</button>

          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>{" "}
          {/* Logout Button */}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Welcome to Your Dashboard</h1>
        <nav style={styles.navbar}>
          <button onClick={() => navigate("/p")}>View Products</button>
          <button onClick={handleFlightSearchClick}>Search Flights</button>
          <button onClick={handleHotelSearchClick}>Search Hotels</button>
          <button
            onClick={() =>
              navigate("/upcoming-activitiest", {
                state: { touristId: touristId },
              })
            }
            style={styles.navLink}
          >
            Activities
          </button>
          <button
            onClick={() =>
              navigate("/upcoming-itinerariest", {
                state: { touristId: touristId },
              })
            }
            style={styles.navLink}
          >
            Itineraries
          </button>

          <Link to="/HPT" style={styles.navLink}>
            Historical Places
          </Link>
          <Link to="/museusemst" style={styles.navLink}>
            Museums
          </Link>
          <Link to="/transportationBooking" style={styles.navLink}>
            Book Transportation
          </Link>
          <button onClick={handleFileComplaintClick} style={styles.navLink}>
            File a Complaint
          </button>
        </nav>
        {/* Booked Flights Section */}
        <div style={styles.bookedFlightsSection}>
          <h3 style={styles.sectionHeader}>Your Booked Flights</h3>
          {bookedFlights.length > 0 ? (
            <ul style={styles.bookedFlightsList}>
              {bookedFlights.map((flight, index) => (
                <li key={index} style={styles.flightItem}>
                  <p>
                    <strong>Flight Number:</strong> {flight.flightNumber}
                  </p>
                  <p>
                    <strong>Departure:</strong> {flight.departure}
                  </p>
                  <p>
                    <strong>Arrival:</strong> {flight.arrival}
                  </p>
                  <p>
                    <strong>Date:</strong> {flight.date}
                  </p>
                  <p>
  <strong>Price:</strong> {flight.price.currency} {flight.price.total}
</p>

                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noFlightsText}>You have no booked flights.</p>
          )}
        </div>

        <div style={styles.bookedHotelsSection}>
          <h3 style={styles.sectionHeader}>Your Booked Hotels</h3>
          {bookedHotels.length > 0 ? (
            <ul style={styles.bookedHotelsList}>
              {bookedHotels.map((hotel, index) => (
                <li key={index} style={styles.flightItem}>
                  <p>
                    <strong>Hotel Name:</strong> {hotel.hotelName}
                  </p>
                  <p>
                    <strong>Check In Date:</strong> {hotel.offer.checkInDate}
                  </p>
                  <p>
                    <strong>Check Out Date:</strong> {hotel.offer.checkOutDate}
                  </p>
                  <p>
                    <strong>Guests:</strong> {hotel.offer.guests.adults}
                  </p>
                  <p>
                    <strong>price:</strong>
                    {hotel.offer.price.currency} {hotel.offer.price.total}
                  </p>
                  <p>
                    <strong>Room:</strong> {hotel.offer.room.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noFlightsText}>You have no booked Hotels.</p>
          )}
        </div>
        <div style={styles.complaintsSection}>
          <h3>Your Complaints</h3>
          {complaints.length > 0 ? (
            <ul style={styles.complaintsList}>
              {complaints.map((complaint, index) => (
                <li key={index} style={styles.complaintItem}>
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
            <p>No complaints found.</p>
          )}
        </div>

        {/* Search Bar Section */}
        <div style={styles.searchSection}>
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
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>

        {/* Search Results Section */}
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsHeader}>Search Results:</h3>
          {searchResults.Museums.length > 0 ||
          searchResults.HistoricalPlace.length > 0 ||
          searchResults.activities.length > 0 ||
          searchResults.itinaries.length > 0 ? (
            <ul style={styles.resultsList}>
              {/* Museums */}
              {searchResults.Museums.map((museum, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>Name: {museum.tourismGovernerTags.name}</h4>
                  <p>Description: {museum.description}</p>
                  <p>Location: {museum.location}</p>
                  <p>Opening Hours: {museum.openingHours}</p>
                  <p>foreignerTicketPrice: ${museum.foreignerTicketPrice}</p>
                  <p>nativeTicketPrice: ${museum.nativeTicketPrice}</p>
                  <p>studentTicketPrice: ${museum.studentTicketPrice}</p>
                  {findLocationMap(museum.location) && (
                    <iframe
                      title="Map"
                      src={findLocationMap(museum.location)}
                      style={styles.map}
                    ></iframe>
                  )}
                </li>
              ))}
              {/* Historical Places */}
              {searchResults.HistoricalPlace.map((place, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>Name: {place.tourismGovernerTags.name}</h4>
                  <p>Description: {place.description}</p>
                  <p>Location: {place.location}</p>
                  <p>Opening Hours: {place.openingHours}</p>
                  <p>foreignerTicketPrice: ${place.foreignerTicketPrice}</p>
                  <p>nativeTicketPrice: ${place.nativeTicketPrice}</p>
                  <p>studentTicketPrice: ${place.studentTicketPrice}</p>
                  {findLocationMap(place.location) && (
                    <iframe
                      title="Map"
                      src={findLocationMap(place.location)}
                      style={styles.map}
                    ></iframe>
                  )}
                </li>
              ))}
              {/* Activities */}
              {searchResults.activities.map((activity, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>{activity.name}</h4>
                  <p>Date: {activity.date}</p>
                  <p>Time: {activity.time}</p>
                  <p>Location: {activity.location}</p>
                  <p>Price: ${activity.price}</p>
                  <p>Special Discount: ${activity.specialDiscount}</p>
                  <p>Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</p>
                  {findLocationMap(activity.location) && (
                    <iframe
                      title="Map"
                      src={findLocationMap(activity.location)}
                      style={styles.map}
                    ></iframe>
                  )}
                </li>
              ))}
              {/* Itineraries */}
              {searchResults.itinaries.map((itinerary, index) => (
                <li key={index} style={styles.resultItem}>
                  <h4>{itinerary.name}</h4>
                  <p>{itinerary.activities.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.noResultsText}>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Improved styles for the modern look
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f8fa",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    //backgroundColor: "#2d3e50",
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
  walletText: {
    fontSize: "18px",
    margin: "10px 0",
  },
  button: {
    backgroundColor: "#ff6348",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
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
  searchSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  dropdown: {
    padding: "10px",
    borderRadius: "4px",
    marginRight: "10px",
  },
  searchButton: {
    padding: "10px 20px",
    //backgroundColor: "#2d3e50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    //backgroundColor: "#2d3e50",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "4px",
   // backgroundColor: "#2d3e50",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  resultsContainer: {
    marginTop: "20px",
  },
  resultsHeader: {
    fontSize: "22px",
    marginBottom: "15px",
    color: "#333",
  },
  resultsList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  resultItem: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
  map: {
    width: "100%",
    height: "250px",
    border: "none",
    borderRadius: "10px",
    marginTop: "10px",
  },
  noResultsText: {
    fontSize: "18px",
    color: "#999",
  },
  complaintsSection: {
    marginTop: "20px",
  },
  complaintsList: {
    listStyleType: "none",
    padding: 0,
  },
  complaintItem: {
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default TouristHome;
