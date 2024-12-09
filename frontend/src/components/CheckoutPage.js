import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import axios from "axios";

const CheckoutPage = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const API_URL = "http://localhost:8000";
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);
  // Fetch existing addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage("Please log in to view your addresses.");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/home/tourist/geta/${userId}`);
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setMessage("Failed to load addresses.");
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please log in to add an address.");
      return;
    }

    try {
      await axios.post(`${API_URL}/home/tourist/address/${userId}`, {
        address,
        city,
        state,
        postalCode,
        country,
      });
      setMessage("Address added successfully!");

      // Refresh the address list
      const response = await axios.get(`${API_URL}/home/tourist/geta/${userId}`);
      setAddresses(response.data);

      // Clear the input fields
      setAddress("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
    } catch (error) {
      console.error("Error adding address:", error);
      setMessage("Failed to add address.");
    }
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
    setMessage(`Selected address: ${addressId}`);
  };

  const handleContinueToPayment = () => {
    navigate(`/payment-options, { state: { addressId: selectedAddress } }`);
  };

  return (
    <div className="checkout-container">
                <h3 className="total-revenue1">Checkout</h3>
                {message && <p className="error-message">{message}</p>}

      {/* Form to Add a New Address */}
      <form
        className="checkout-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAddress();
        }}
      >
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="checkout-input"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="checkout-input"
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="checkout-input"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          className="checkout-input"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="checkout-input"
        />
        <button type="submit" className="reply-button">
          Add Address
        </button>
      </form>

      {/* Display Existing Addresses */}
      <h3 className="total-revenue1">Your Addresses</h3>
      {addresses.length === 0 ? (
        <p>No addresses added yet.</p>
      ) : (
        <ul className="address-list">
          {addresses.map((addr) => (
            <li
              key={addr._id}
              className={`address-item ${
                selectedAddress === addr._id ? "selected" : ""
              }`}
              onClick={() => handleSelectAddress(addr._id)}
            >
              <p>
                <strong>Address:</strong> {addr.address}
              </p>
              <p>
                <strong>City:</strong> {addr.city}
              </p>
              <p>
                <strong>State:</strong> {addr.state || "N/A"}
              </p>
              <p>
                <strong>Postal Code:</strong> {addr.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {addr.country}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Continue to Payment */}
      {selectedAddress && (
        <button onClick={handleContinueToPayment} className="payment-button">
          Continue to Payment
        </button>
      )}
    </div>
  );
};

export default CheckoutPage;