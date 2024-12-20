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

  const [existingLogo, setExistingLogo] = useState(""); // State for existing logo URL
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  //const fileInputRef = useRef(null);

  // Fetch existing advertiser data when component loads
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

          // Set existing logo URL if it exists
          if (advertiser.logo) {
            setExistingLogo(
              `http://localhost:8000/uploads/adverImages/${advertiser.logo}`
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
        setImagePreview(reader.result);
        console.log(imagePreview);
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, logoFile: file }); // Set the logo file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adverId = localStorage.getItem("userId"); // Get advertiser ID from local storage

    if (!adverId) {
      alert("Advertiser ID is missing.");
      return;
    }

    setLoading(true); // Set loading state while the request is being processed

    const formDataWithLogo = new FormData(); // Use FormData to handle both text fields and file upload

    // Append text fields
    for (const key in formData) {
      formDataWithLogo.append(key, formData[key]);
    }

    // Append Profile_Completed field to true
    formDataWithLogo.append("Profile_Completed", true);

    // Append the logo file if a new one has been uploaded
    if (formData.logoFile) {
      formDataWithLogo.append("logoFile", formData.logoFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/home/adver/updateadver/${adverId}`,
        formDataWithLogo,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is sent as multipart/form-data
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Advertiser updated successfully!");

        // If logo is updated, set the new logo
        if (response.data.logo) {
          setExistingLogo(
            `http://localhost:8000/uploads/adverImages/${response.data.logo}`
          );
        }

        setTimeout(() => navigate("/list", { state: { id: adverId } }), 2000); // Redirect after a short delay
      }
    } catch (error) {
      console.error("Error updating advertiser:", error);
      alert(
        "Error updating advertiser: " +
          (error.response ? error.response.data.error : error.message)
      );
    } finally {
      setLoading(false); // Reset loading state after request completion
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
            <label>Link:</label>
            <input
              type="text"
              name="Link"
              value={formData.Link}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Hotline:</label>
            <input
              type="number"
              name="Hotline"
              value={formData.Hotline}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Profile:</label>
            <input
              type="text"
              name="Profile"
              value={formData.Profile}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Location:</label>
            <input
              type="text"
              name="Loc"
              value={formData.Loc}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Company Description:</label>
            <input
              type="text"
              name="CompanyDes"
              value={formData.CompanyDes}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Services:</label>
            <input
              type="text"
              name="Services"
              value={formData.Services}
              onChange={handleChange}
              required
            />
          </div>
        </form>

        <label style={{ display: "block", marginBottom: "10px" }}>
          Picture:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setFormData)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAdvertiser;
