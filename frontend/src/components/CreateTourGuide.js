import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UpdateTourGuide = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Age: "",
    LanguagesSpoken: "",
    MobileNumber: "",
    YearsOfExperience: "",
    PreviousWork: "",
  });

  const [photo, setPhoto] = useState(null); // State to store the selected photo file
  const [existingPhoto, setExistingPhoto] = useState(""); // State for existing photo URL
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tourGuideId = localStorage.getItem("userId"); // Assuming tour guide ID is stored in local storage

    // Fetch existing tour guide details from the backend
    if (tourGuideId) {
      axios
        .get(`http://localhost:8000/TourGuide/users/${tourGuideId}`)
        .then((response) => {
          const tourGuide = response.data;

          // Manually set the necessary fields only
          setFormData({
            UserName: tourGuide.UserName || "",
            Email: tourGuide.Email || "",
            Age: tourGuide.Age || "",
            LanguagesSpoken: tourGuide.LanguagesSpoken || "",
            MobileNumber: tourGuide.MobileNumber || "",
            YearsOfExperience: tourGuide.YearsOfExperience || "",
            PreviousWork: tourGuide.PreviousWork || "",
          });

          // Set existing photo URL
          if (tourGuide.Photo) {
            setExistingPhoto(
              `http://localhost:8000/uploads/tourGuidePhotos/${tourGuide.Photo}`
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching tour guide data:", error);
          alert("Error fetching tour guide data. Please try again.");
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]); // Store the selected photo file in state
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
    const tourGuideId = localStorage.getItem("userId"); // Get tour guide ID from local storage
    console.log("Updating tour guide with ID:", tourGuideId);

    const formDataWithPhoto = new FormData(); // Use FormData to handle both text fields and file upload

    // Append text fields
    for (const key in formData) {
      formDataWithPhoto.append(key, formData[key]);
    }

    // Append the photo if it's been uploaded
    if (photo) {
      formDataWithPhoto.append("Photo", photo); // Add photo to form data
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/TourGuide/update/${tourGuideId}`,
        formDataWithPhoto,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is sent as multipart/form-data
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Tour guide updated successfully!");
        setTimeout(
          () => navigate("/tour-guide", { state: { id: tourGuideId } }),
          2000
        ); // Redirect after a short delay
      }
    } catch (error) {
      console.error("Error updating tour guide:", error);
      alert(
        "Error updating tour guide: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Update Tour Guide Profile</h2>

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

        {/* Photo file input */}
        <div>
        <label style={{ display: 'block', marginBottom: '10px' }}>Picture:</label>
            <input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e, setFormData)}
  required
/>
        </div>

        {/* Display existing photo if available */}
        {existingPhoto && (
          <div>
            <h4>Current Photo:</h4>
            <img
              src={existingPhoto}
              alt="Current Tour Guide Photo"
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
            to={`/tour-guide`}
            state={{ id: localStorage.getItem("userId") }}
          >
            View Tour Guide Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdateTourGuide;
