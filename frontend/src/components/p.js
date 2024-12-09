import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, buyProduct } from "../services/ProductService"; // Ensure you have this service function defined
import axios from "axios";
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
import "../css/touristproduct.css";
import img1 from "./logoo4.JPG";

const ProductListp = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [message, setMessage] = useState("");
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [touristData, setTouristData] = useState([]);
  const [purchasedProductDetails, setPurchasedProductDetails] = useState([]);
  const [cart, setCart] = useState([]);

  const userId = localStorage.getItem("userId");
  const API_URL = "http://localhost:8000";

  const navigate = useNavigate(); // Initialize useNavigate
  const touristId = localStorage.getItem("userId");

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
    fetchTouristData();
    fetchPurchasedProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      // Filter out archived products
      const unarchivedProducts = data.filter((product) => !product.isArchived);
      setProducts(unarchivedProducts);
      setFilteredProducts(unarchivedProducts);
    } catch (error) {
      setMessage("Error fetching products");
      console.error("Error fetching products", error);
    }
  };
  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await axios.get(
        `${API_URL}/home/tourist/cart/${userId}`
      );
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };
  const handleAddToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/home/tourist/add/${userId}/${productId}`
      );
      setCart(response.data.cart); // Update the cart state
      setMessage("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error); // Display server error
      } else {
        setMessage("Failed to add product to cart.");
      }
    }
  };

  const handleUpdateClick = () => {
    navigate("/tourist-update");
  };

  const handleRedeemPoints = async () => {
    if (touristData.points <= 0) {
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

  const handleBuyProduct = async (userId, productId) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (product.availableQuantity > 0) {
        // Call your API to buy the product
        await buyProduct(userId, productId);
        setMessage("Product purchased successfully!");
        fetchProducts(); // Re-fetch products to update the available quantity
      } else {
        setMessage("Sorry, this product is out of stock.");
      }
    } catch (error) {
      setMessage("Error purchasing product");
      console.error("Error purchasing product", error);
    }
  };
  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem("userToken"); // Example: remove token from localStorage
    navigate("/login"); // Redirect to the login page
  };

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



  const handleBooking = async (productId) => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setMessage("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      // Make an API call to book the transportation and pass touristId and transportationId
      const response = await axios.post(
        `${API_URL}/home/tourist/buyProduct/${userId}/${productId}`
      );

      setMessage("product purchased successfully!");

      // Update the transportation list to reflect the seat decrement and booking closure
      const updatedProducts = products.map((product) =>
        product._id === productId
          ? { ...product, availableQuantity: product.availableQuantity - 1 }
          : product
      );

      setProducts(updatedProducts);
      fetchProducts();
      //fetchTouristData();
      fetchPurchasedProducts();

      // Optionally, you can show the booked transportations separately below the available ones
      //fetchBookedTransportations();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error booking transportation:", error);
      setMessage("Failed to book transportation. Please try again.");
    }
  };

  const fetchTouristData = async () => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    try {
      const response = await axios.get(
        `http://localhost:8000/home/tourist/getTourist/${userId}`
      );
      setTouristData(response.data);
      console.log(response.data);
      console.log(response.data.purchasedProducts);
      setPurchasedProducts(response.data.purchasedProducts);
      console.log(touristData);
      console.log(purchasedProducts);
    } catch (error) {
      console.error("Error fetching tourist data:", error);
    }
  };

  const fetchPurchasedProducts = async () => {
    const userId = localStorage.getItem("userId"); // Fetch tourist ID from localStorage
    if (!userId) {
      setMessage("User ID not found in local storage. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/home/tourist/getPurchasedProducts/${userId}`
      );
      setPurchasedProductDetails(response.data);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setMessage("Failed to fetch purchased products. Please try again later.");
    }
  };

  const filterProducts = (searchTerm, minPrice, maxPrice, sortOrder) => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        (minPrice === "" || product.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || product.price <= parseFloat(maxPrice));
      return matchesSearch && matchesPrice;
    });

    // Sort products by rating
    filtered.sort((a, b) => {
      return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
    });

    setFilteredProducts(filtered);
  };

  const handleRatingChange = (e, productId) => {
    setPurchasedProductDetails((prevDetails) =>
      prevDetails.map((product) =>
        product._id === productId
          ? { ...product, newRating: e.target.value }
          : product
      )
    );
  };

  // Handle review input change
  const handleReviewChange = (e, productId) => {
    setPurchasedProductDetails((prevDetails) =>
      prevDetails.map((product) =>
        product._id === productId
          ? { ...product, newReview: e.target.value }
          : product
      )
    );
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/home/tourist/${userId}/wishlist/add`,
        { productId }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
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

  // Function to handle rating submission
  // Function to handle rating submission
  const handleSubmitRating = async (productId) => {
    const product = purchasedProductDetails.find(
      (prod) => prod._id === productId
    );

    if (product && product.newRating) {
      try {
        const response = await fetch(
          `${API_URL}/home/tourist/rateProduct/${productId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: parseInt(product.newRating, 10) }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Update the product details with the new average rating and reset the rating input
          setPurchasedProductDetails((prevDetails) =>
            prevDetails.map((prod) =>
              prod._id === productId
                ? {
                    ...prod,
                    rating: data.avgRating, // Update with the new average rating
                    newRating: "", // Reset newRating input field
                  }
                : prod
            )
          );

          // Re-fetch products to update the list with the new rating
          await fetchProducts();
        } else {
          console.error("Error submitting rating:", response.statusText);
          setMessage("Failed to submit rating.");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    } else {
      alert("Please enter a rating.");
    }
  };

  // Function to handle review submission
  const handleSubmitReview = async (productId) => {
    const product = purchasedProductDetails.find(
      (prod) => prod._id === productId
    );

    if (product && product.newReview) {
      try {
        const response = await fetch(
          `${API_URL}/home/tourist/reviewProduct/${productId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review: product.newReview }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Update the specific product's reviews and reset the new review input
          setPurchasedProductDetails((prevDetails) =>
            prevDetails.map((prod) =>
              prod._id === productId
                ? {
                    ...prod,
                    reviewsText: [...prod.reviewsText, product.newReview], // Append the new review
                    newReview: "", // Reset newReview input field
                  }
                : prod
            )
          );

          // Re-fetch products to update the list with the new review
          await fetchProducts();
        } else {
          console.error("Error submitting review:", response.statusText);
          setMessage("Failed to submit review.");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    } else {
      setMessage("Please enter a review.");
    }
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
              <p className="wallet-text">
                Loyalty Points: {touristData.Loyalty_Points}
              </p>
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
          {/* Tabs for navigation */}
          <Tabs defaultActiveKey="products" className="main-content-tabs">
            <Tab eventKey="products" title="Products">
              <div className="tab-content">
                <div className="card-container">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product._id} className="product-card">
                        <img
                          src={
                            product.pictures
                              ? `data:image/png;base64,${product.pictures}`
                              : "https://via.placeholder.com/150"
                          }
                          alt="Product"
                          className="product-image"
                        />
                        <div className="product-details">
                          <h3 className="product-title">
                            {product.description}
                          </h3>
                          <p className="product-seller">
                            Quantity: {product.availableQuantity}
                          </p>
                          <p className="product-price">${product.price}</p>
                          <p className="product-seller">
                            Seller: {product.sellerDetails?.name || "Unknown"}
                          </p>
                          <div className="product-rating">
                            {"★".repeat(Math.round(product.avgRating))}
                            {"☆".repeat(5 - Math.round(product.avgRating))}
                            <span>({product.avgRating.toFixed(1)})</span>
                          </div>
                          <div className="product-actions">
                            <button
                              className="action-button"
                              onClick={() => handleAddToCart(product._id)}
                            >
                              Add to Cart
                            </button>
                            <button
                              className="action-button"
                              onClick={() => handleAddToWishlist(product._id)}
                            >
                              Add to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-products-text">No products found</p>
                  )}
                </div>
              </div>
            </Tab>
            <Tab eventKey="reviews" title="Reviews">
              <div className="tab-content">
                <div className="reviews-container">
                  {filteredProducts.map((product) =>
                    product.reviewsText && product.reviewsText.length > 0 ? (
                      <div key={product._id} className="review-card">
                        <h4 className="review-product-title">
                          Reviews for {product.description}
                        </h4>
                        {product.reviewsText.map((review, index) => (
                          <p key={index} className="review-text">
                            "{review}"
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p key={product._id} className="no-reviews-text">
                        No reviews available for {product.description}.
                      </p>
                    )
                  )}
                </div>
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

export default ProductListp;
