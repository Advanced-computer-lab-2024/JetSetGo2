import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UpdateSeller = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Name: "",
    PickUp_Location: "",
    Type_Of_Products: "",
    Previous_Work: "",
    Age: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sellerId = localStorage.getItem("userId"); // Assuming seller ID is stored in local storage

    // Fetch existing seller details from the backend
    if (sellerId) {
      axios
        .get(`http://localhost:8000/Seller/readSeller/${sellerId}`)
        .then((response) => {
          const seller = response.data;

          // Manually set the necessary fields only
          setFormData({
            UserName: seller.UserName || "",
            Email: seller.Email || "",
            Name: seller.Name || "",
            PickUp_Location: seller.PickUp_Location || "",
            Type_Of_Products: seller.Type_Of_Products || "",
            Previous_Work: seller.Previous_Work || "",
            Age: seller.Age || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching seller data:", error);
          alert("Error fetching seller data. Please try again.");
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event, setData) => {
    const file = event.target.files[0];
    if (file) {
      // You might need to convert the image file to a URL or base64 format
      const reader = new FileReader();
      reader.onloadend = () => {
        // Assuming you want to store the image as a string URL
        setData((prevData) => ({
          ...prevData,
          pictures: reader.result, // Store the image URL in formData
        }));
        //setImagePreview(reader.result);
        //console.log(imagePreview);
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellerId = localStorage.getItem("userId"); // Get seller ID from local storage
    console.log("Updating seller with ID:", sellerId);

    const formDataWithLogo = new FormData(); // Use FormData to handle both text fields and file upload

    // Append text fields
    for (const key in formData) {
      formDataWithLogo.append(key, formData[key]);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/Seller/updateSeller/${sellerId}`,
        formDataWithLogo,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is sent as multipart/form-data
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Seller updated successfully!");
        setTimeout(
          () => navigate("/seller-details", { state: { id: sellerId } }),
          2000
        ); // Redirect after a short delay
      }
    } catch (error) {
      console.error("Error updating seller:", error);
      alert(
        "Error updating seller: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Create Profile</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>User Name:</label>
            <input
              type="text"
              name="UserName"
              value={formData.UserName}
              onChange={handleChange}
              required
            />
          </div>
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
            <label>Name:</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Pick Up Location:</label>
            <input
              type="text"
              name="PickUp_Location"
              value={formData.PickUp_Location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Type Of Products:</label>
            <input
              type="text"
              name="Type_Of_Products"
              value={formData.Type_Of_Products}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Previous Work:</label>
            <input
              type="text"
              name="Previous_Work"
              value={formData.Previous_Work}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="Age"
              value={formData.Age}
              onChange={handleChange}
              required
            />
          </div>
        </form>

        {/* Logo file input */}
        <div>
          <label style={{ display: "block", marginBottom: "10px" }}>
            Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setFormData)}
            required
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default UpdateSeller;
