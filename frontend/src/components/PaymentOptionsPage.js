import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QQBfPKbaBifWGn14vu2SZhspEMUJn56AZy9Kcmrq3v8XQv0LDF3rLapvsR6XhA7tZ3YS6vXgk0xgoivUwm03ACZ00NI0XGIMx");

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      alert("Stripe is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: "Customer Name" },
        },
      });

      if (error) {
        console.error("Payment error:", error);
        alert("Payment failed. Please try again.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error("Error during payment confirmation:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
          hidePostalCode: true,
        }}
      />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const PaymentOptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId } = location.state; // Address ID passed from the previous page
  const [showPopup, setShowPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please log in to view your cart.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/home/tourist/cart/${userId}`);
      setCartItems(response.data); // Assuming backend returns populated cart with product and quantity
    } catch (error) {
      console.error("Error fetching cart:", error);
      setMessage("Failed to load cart items.");
    }
  };
  const handlePayment = async (method) => {
    setPaymentMethod(method); // Set the payment method for further processing

    if (method === "cash") {
        setShowPopup(true); // Show confirmation popup for cash on delivery
    } else if (method === "wallet") {
        await handlePurchase(); // Process wallet payment
    } else if (method === "card") {
        await initiateCardPayment(); // Prepare Stripe payment
    }
};
const initiateCardPayment = async () => {
  const touristId = localStorage.getItem("userId");
  console.log("Initiating payment...");
  console.log("Tourist ID:", touristId);
  console.log("Address ID:", addressId);

  try {
    const payload = {
      touristId,
      addressId,
      paymentMethod: "card",
    };
    console.log("Payload being sent:", payload);

    const response = await axios.post(`${API_URL}/home/tourist/buyProducts`, payload);
    console.log("Response from server:", response.data);

    const { clientSecret } = response.data;

    if (clientSecret) {
      setClientSecret(clientSecret);
      setIsPaymentModalOpen(true);
    } else {
      alert("Error initiating card payment. Please try again.");
    }
  } catch (error) {
    console.error("Error initiating card payment:", error.response || error);
    alert(error.response?.data?.error || "Error initiating card payment. Please try again.");
  }
};

const handlePurchase = async (paymentIntentId = null) => {
  const touristId = localStorage.getItem("userId");

  if (!touristId || !addressId) {
      alert("Tourist ID or Address ID is missing.");
      return;
  }

  try {
      const response = await axios.post(`${API_URL}/home/tourist/buyProducts`, {
          touristId,
          addressId,
          paymentMethod,
          paymentIntentId: paymentIntentId || null, // Only for card payments
      });

      if (paymentMethod === "wallet") {
        try {
          const response = await axios.post(`${API_URL}/home/tourist/buyProducts`, {
            touristId,
            addressId,
            paymentMethod,
          });
      
          if (response.data.message) {
            alert(response.data.message); // Show success message from backend
            navigate("/my-orders"); // Redirect to orders page
          }
        } catch (error) {
          console.error("Error completing wallet payment:", error);
      
          // Show error message from backend if available
          const errorMessage = error.response?.data?.error || "Error completing purchase. Please try again.";
          alert(errorMessage);
        }
      
      
      } else if (paymentMethod === "cash") {
          alert("Order placed successfully! Pay cash on delivery.");
          navigate("/my-orders"); // Redirect to orders page

      }
  } catch (error) {
      console.error("Error completing purchase:", error);
      alert("Error completing purchase. Please try again.");
  }
};

const handlePaymentSuccess = async (paymentIntentId) => {
    setIsPaymentModalOpen(false);
    await handlePurchase(paymentIntentId); // Finalize the card payment
    navigate("/my-orders"); // Redirect to orders page
};

  const confirmOrder = async () => {
    await handlePurchase();
    setShowPopup(false);
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
        onClick={() => handlePayment("card")}
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

      {isPaymentModalOpen && (
        <Elements stripe={stripePromise}>
          <PaymentForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
        </Elements>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <h3>Confirm Your Order</h3>
          <p>Your products will be delivered soon. Do you want to confirm the order?</p>
          <button
            onClick={confirmOrder}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => setShowPopup(false)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentOptionsPage;
