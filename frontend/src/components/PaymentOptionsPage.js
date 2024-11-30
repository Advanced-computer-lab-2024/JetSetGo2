import React from "react";
import { useLocation } from "react-router-dom";

const PaymentOptionsPage = () => {
  const location = useLocation();
  const { addressId } = location.state;

  const handlePayment = (method) => {
    console.log(`Selected payment method: ${method}, Address ID: ${addressId}`);
    // Proceed with payment logic (e.g., Stripe integration, wallet deduction, etc.)
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f7f8fa" }}>
      <h2>Payment Options</h2>
      <p>Selected Address ID: {addressId}</p>
      <button
        onClick={() => handlePayment("wallet")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay with Wallet
      </button>
      <button
        onClick={() => handlePayment("credit_card")}
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
        Pay with Credit Card
      </button>
      <button
        onClick={() => handlePayment("cash")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#ffc107",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cash on Delivery
      </button>
    </div>
  );
};

export default PaymentOptionsPage;
