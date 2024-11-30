import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    // Navigate to the payment options page and pass the selected address
    navigate(`/payment-options`, { state: { addressId: selectedAddress } });
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f7f8fa" }}>
      <h2>Checkout</h2>
      {message && <p>{message}</p>}

      {/* Form to Add a New Address */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddAddress();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Address
        </button>
      </form>

      {/* Display Existing Addresses */}
      <h3>Your Addresses</h3>
      {addresses.length === 0 ? (
        <p>No addresses added yet.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {addresses.map((addr) => (
            <li
              key={addr._id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: selectedAddress === addr._id ? "#d4edda" : "#fff",
              }}
              onClick={() => handleSelectAddress(addr._id)}
            >
              <p><strong>Address:</strong> {addr.address}</p>
              <p><strong>City:</strong> {addr.city}</p>
              <p><strong>State:</strong> {addr.state || "N/A"}</p>
              <p><strong>Postal Code:</strong> {addr.postalCode}</p>
              <p><strong>Country:</strong> {addr.country}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Continue to Payment */}
      {selectedAddress && (
        <button
          onClick={handleContinueToPayment}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Continue to Payment
        </button>
      )}
    </div>
  );
};

export default CheckoutPage;
