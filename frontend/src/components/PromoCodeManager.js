import React, { useState, useEffect } from "react";
import axios from "axios";

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    expiryDate: "",
    isActive: true,
  });
  const [message, setMessage] = useState("");

  // Fetch promo codes on component mount
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/promo/get"); // Adjust base URL as needed
      setPromoCodes(response.data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/promo/create",
        formData
      );
      setMessage("Promo code created successfully!");
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        expiryDate: "",
        isActive: true,
      });
      fetchPromoCodes(); // Refresh the list
    } catch (error) {
      setMessage("Error creating promo code.");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Promo Code Manager</h1>

      {/* Form for creating a new promo code */}
      <form onSubmit={handleCreatePromoCode} style={{ marginBottom: "20px" }}>
        <div>
          <label>
            Promo Code:
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Discount Type:
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              style={{ marginLeft: "10px" }}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Discount Value:
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              required
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Expiry Date:
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Active:
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Create Promo Code
        </button>
      </form>

      {/* Message display */}
      {message && <p>{message}</p>}

      {/* Display list of promo codes */}
      <h2>Existing Promo Codes</h2>
      <ul>
        {promoCodes.length > 0 ? (
          promoCodes.map((promo, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>Code:</strong> {promo.code} |<strong> Type:</strong>{" "}
              {promo.discountType} |<strong> Value:</strong>{" "}
              {promo.discountValue} |<strong> Start:</strong>{" "}
              {new Date(promo.startDate).toLocaleDateString()} |
              <strong> Expiry:</strong>{" "}
              {new Date(promo.expiryDate).toLocaleDateString()} |
              <strong> Active:</strong> {promo.isActive ? "Yes" : "No"}
            </li>
          ))
        ) : (
          <p>No promo codes available.</p>
        )}
      </ul>
    </div>
  );
};

export default PromoCodeManager;
