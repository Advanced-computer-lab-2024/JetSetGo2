import React, { useState } from "react";
import axios from "axios";

const OtherSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/home/other/addOther", // Adjust the endpoint as necessary
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default OtherSignup;
