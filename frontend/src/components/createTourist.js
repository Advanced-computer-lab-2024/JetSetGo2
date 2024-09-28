import React, { useState } from "react";
import axios from "axios";

const TouristSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    MobileNumber: "",
    Nationality: "",
    DateOfBirth: "",
    Job: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/home/tourist/addTourist",
        formData
      );
      console.log("Signup successful:", response.data);
      // Optionally, handle successful signup (e.g., redirect to another page)
    } catch (error) {
      console.error("Error signing up:", error);
      // Optionally, handle errors (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>UserName:</label>
        <input
          type="text"
          name="UserName"
          value={formData.UserName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input
          type="number"
          name="MobileNumber"
          value={formData.MobileNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nationality:</label>
        <input
          type="text"
          name="Nationality"
          value={formData.Nationality}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="DateOfBirth"
          value={formData.DateOfBirth}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Job:</label>
        <input
          type="text"
          name="Job"
          value={formData.Job}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default TouristSignup;
