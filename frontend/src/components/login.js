import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled.div`
  font-family: "Arial", sans-serif;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  margin: auto;
  margin-top: 100px;
`;

const LoginTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const LoginInput = styled.input`
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const LoginButton = styled.button`
  padding: 0.75rem;
  margin-top: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 1rem;
`;

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login/login", {
        Email,
        Password,
      });

      // Check for successful login response
      if (response.status === 200) {
        const { token, userId, AccountType, profileCompleted, adminAccept } =
          response.data;

        // Store the token and user ID in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        setSuccessMessage("Login successful!");
        setErrorMessage("");

        if (AccountType === "Tourist") {
          navigate("/tourist-home");
        }

        if (!adminAccept) {
          navigate("/AdminAcceptance");
        } else if (!profileCompleted) {
          // Navigate based on profile completion and AccountType
          if (AccountType === "TourGuide") {
            navigate("/CreateTourGuide"); // Redirect to profile completion page
          } else if (AccountType === "Advertiser") {
            navigate("/AdvirtiserMain"); // Redirect to profile completion page
          } else if (AccountType === "Seller") {
            navigate("/CreateSeller"); // Redirect to profile completion page
          }
        } else {
          if (AccountType === "TourGuide") {
            navigate("/tour-guide");
          } else if (AccountType === "Advertiser") {
            navigate("/list");
          } else if (AccountType === "Seller") {
            navigate("/seller-details");
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data.message || "Login failed. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <LoginContainer>
      <LoginTitle>Login</LoginTitle>
      <LoginForm onSubmit={handleLogin}>
        <LoginInput
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoginInput
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LoginButton type="submit">Login</LoginButton>
      </LoginForm>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </LoginContainer>
  );
};

export default Login;
