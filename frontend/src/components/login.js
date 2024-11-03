import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  font-family: 'Arial', sans-serif;
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
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login/login', { Email, Password });
      const { userType } = response.data;
      localStorage.setItem('token', response.data.token);

      setSuccessMessage('Login successful!');
      setErrorMessage('');

      // Check if this is the user's first login
      const hasLoggedInBefore = localStorage.getItem(`hasLoggedInBefore_${Email}`);

      if (!hasLoggedInBefore) {
        // First-time login, store the flag in localStorage
        localStorage.setItem(`hasLoggedInBefore_${Email}`, 'true');
        if (userType === 'TourGuide') {
          navigate('/CreateTourGuide');
        } else if (userType === 'Advertiser') {
          navigate('/AdvirtiserMain');
        } else if (userType === 'Seller') {
          navigate('/CreateSeller');
        } else if (userType === 'Tourist') {
          navigate('/tourist-home');
        } else {
          setErrorMessage('User type not recognized.');
        }
      } else {
        // Second or subsequent login
        if (userType === 'TourGuide') {
          navigate('/tour-guide');
        } else if (userType === 'Advertiser') {
          navigate('/list');
        } else if (userType === 'Seller') {
          navigate('/seller-details');
        } else if (userType === 'Tourist') {
          navigate('/tourist-home');
        } else {
          setErrorMessage('User type not recognized.');
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Login failed. Please try again.');
      setSuccessMessage('');
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
