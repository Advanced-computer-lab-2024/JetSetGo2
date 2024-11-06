import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UpdateSeller = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Name: "",
    PickUp_Location: "",
    Type_Of_Products: "",
    Previous_Work: "",
    Age: "",
  });

  const [logo, setLogo] = useState(null); // State to store the selected logo file
  const [existingLogo, setExistingLogo] = useState(""); // State for existing logo URL
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
            Email: seller.Email || "",
            Name: seller.Name || "",
            PickUp_Location: seller.PickUp_Location || "",
            Type_Of_Products: seller.Type_Of_Products || "",
            Previous_Work: seller.Previous_Work || "",
            Age: seller.Age || "",
          });

          // Set existing logo URL
          if (seller.logo) {
            setExistingLogo(
              `http://localhost:8000/uploads/sellerLogo/${seller.logo}`
            );
          }
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

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]); // Store the selected logo file in state
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

    // Append the logo if it's been uploaded
    if (logo) {
      formDataWithLogo.append("logo", logo); // Add logo to form data
    }

    // Append Profile_Completed field to true
    formDataWithLogo.append("Profile_Completed", true);

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
        <h2>Update Seller Profile</h2>

        {/* Render each form field based on formData keys */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key.replace(/_/g, " ")}:</label>
            <input
              type={key === "Age" ? "number" : "text"} // For Age, use number input type
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Logo file input */}
        <div>
          <label>Logo:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Display existing logo if available */}
        {existingLogo && (
          <div>
            <h4>Current Logo:</h4>
            <img
              src={existingLogo}
              alt="Current Seller Logo"
              style={{ width: "100px", height: "auto" }}
            />
          </div>
        )}

        <button type="submit">Update</button>
      </form>

      {successMessage && (
        <div>
          <p>{successMessage}</p>
          <Link
            to={`/seller-details`}
            state={{ id: localStorage.getItem("userId") }}
          >
            View Seller Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdateSeller;
