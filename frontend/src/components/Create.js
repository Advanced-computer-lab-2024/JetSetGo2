import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const UpdateAdvertiser = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Link: "",
    Hotline: "",
    Profile: "",
    Loc: "",
    CompanyDes: "",
    Services: "",
  });

  const [profileImage, setProfileImage] = useState(null); // State to store the selected profile image file
  const [existingProfileImage, setExistingProfileImage] = useState(""); // State for existing profile image URL
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const adverId = localStorage.getItem("userId"); // Assuming advertiser ID is stored in local storage

    // Fetch existing advertiser details from the backend
    if (adverId) {
      axios
        .get(`http://localhost:8000/home/adver/getadver/${adverId}`)
        .then((response) => {
          const advertiser = response.data;

          // Manually set the necessary fields only
          setFormData({
            UserName: advertiser.UserName || "",
            Email: advertiser.Email || "",
            Link: advertiser.Link || "",
            Hotline: advertiser.Hotline || "",
            Profile: advertiser.Profile || "",
            Loc: advertiser.Loc || "",
            CompanyDes: advertiser.CompanyDes || "",
            Services: advertiser.Services || "",
          });

          // Set existing profile image URL
          if (advertiser.Profile) {
            setExistingProfileImage(
              `http://localhost:8000/uploads/adverImages/${advertiser.Profile}`
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching advertiser data:", error);
          alert("Error fetching advertiser data. Please try again.");
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]); // Store the selected profile image file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adverId = localStorage.getItem("userId"); // Get advertiser ID from local storage
    console.log("Updating advertiser with ID:", adverId);

    const formDataWithImage = new FormData(); // Use FormData to handle both text fields and file upload

    // Append text fields
    for (const key in formData) {
      formDataWithImage.append(key, formData[key]);
    }

    // Append the profile image if it's been uploaded
    if (profileImage) {
      formDataWithImage.append("Profile", profileImage); // Add profile image to form data
    }

    // Append Profile_Completed field to true
    formDataWithImage.append("Profile_Completed", true);

    try {
      const response = await axios.put(
        `http://localhost:8000/home/adver/updateadver/${adverId}`,
        formDataWithImage,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is sent as multipart/form-data
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Advertiser updated successfully!");
        setTimeout(() => navigate("/list", { state: { id: adverId } }), 2000); // Redirect after a short delay
      }
    } catch (error) {
      console.error("Error updating advertiser:", error);
      alert(
        "Error updating advertiser: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "20px" }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Update Advertiser Profile</h2>

        {/* Render each form field based on formData keys */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label>{key.replace(/_/g, " ")}:</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Profile image file input */}
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Display existing profile image if available */}
        {existingProfileImage && (
          <div>
            <h4>Current Profile Image:</h4>
            <img
              src={existingProfileImage}
              alt="Current Advertiser Profile Image"
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
            to={`/advertiser-details`}
            state={{ id: localStorage.getItem("userId") }}
          >
            View Advertiser Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdateAdvertiser;
