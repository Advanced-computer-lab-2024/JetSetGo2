// HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Signup Page</h1>
      <div>
        <button
          style={{ margin: "10px", padding: "10px 20px" }}
          onClick={() => navigate("/tourist-signup")}
        >
          Tourist Signup
        </button>
        <button
          style={{ margin: "10px", padding: "10px 20px" }}
          onClick={() => navigate("/other-signup")}
        >
          Other Signup
        </button>
      </div>
    </div>
  );
};

export default HomePage;
