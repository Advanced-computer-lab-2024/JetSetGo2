import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/othersignup.css"; // Reuse the existing CSS for consistency

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 2 MB file size limit

const OtherSignup = () => {
  const [formData, setFormData] = useState({
    Email: "",
    UserName: "",
    Password: "",
    AccountType: "",
    IDDocument: null,
    Certificates: null,
    TaxationRegistryCard: null,
    acceptTerms: false,
  });

  const [error, setError] = useState(""); // State for error messages
  const [fileErrors, setFileErrors] = useState({}); // State for file error messages
  const [termsError, setTermsError] = useState(""); // State for Terms and Conditions error
  const [termsVisible, setTermsVisible] = useState(false); // State for dialog visibility
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("other-signup-body");
    return () => {
      document.body.classList.remove("other-signup-body");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      name === "IDDocument" ||
      name === "Certificates" ||
      name === "TaxationRegistryCard"
    ) {
      const file = e.target.files[0];
      // Validate file size
      if (file && file.size > MAX_FILE_SIZE) {
        setFileErrors((prev) => ({
          ...prev,
          [name]: "File size exceeds 2 MB limit.",
        }));
        return;
      }
      setFileErrors((prev) => ({ ...prev, [name]: null })); // Reset error if valid
      setFormData({ ...formData, [name]: file });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked }); // Handle checkbox input
    } else {
      setFormData({ ...formData, [name]: value });
      setError(""); // Clear error on input change
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      setTermsError("You must accept the Terms and Conditions.");
      return;
    }
    setTermsError(""); // Clear error if accepted

    const data = new FormData();
    data.append("Email", formData.Email);
    data.append("UserName", formData.UserName);
    data.append("Password", formData.Password);
    data.append("AccountType", formData.AccountType);
    if (formData.IDDocument) data.append("IDDocument", formData.IDDocument);
    if (formData.Certificates)
      data.append("Certificates", formData.Certificates);
    if (formData.TaxationRegistryCard)
      data.append("TaxationRegistryCard", formData.TaxationRegistryCard);

    try {
      console.log("Form Data before submit:", formData); // Debug log
      const response = await axios.post(
        "http://localhost:8000/home/other/addOther", // Adjust the URL if necessary
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Signup failed. Please try again."); // Set error message
    }
  };

  return (
    <div className="other-signup-container">
      {/* Left Section */}
      <div className="other-signup-left">
        <button className="back-to-website-btn" onClick={() => navigate("/")}>
          Back to website →
        </button>
      </div>

      {/* Right Section */}
      <div className="other-signup-right">
        <h2>Create account</h2>
        {error && <p className="other-signup-error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="other-signup-form">
          {/* Email */}
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {/* Username */}
          <input
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          {/* Password */}
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {/* Account Type */}
          <select
            name="AccountType"
            value={formData.AccountType}
            onChange={handleChange}
            required
          >
            <option value="">Select Account Type</option>
            <option value="Advertiser">Advertiser</option>
            <option value="TourGuide">Tour Guide</option>
            <option value="Seller">Seller</option>
          </select>
          {/* ID Document */}
          <input
            type="file"
            name="IDDocument"
            onChange={handleChange}
            accept=".jpg, .jpeg, .png, .pdf"
            required
          />
          {fileErrors.IDDocument && (
            <p className="other-signup-error-message">
              {fileErrors.IDDocument}
            </p>
          )}
          {/* Conditional Fields */}
          {formData.AccountType === "TourGuide" && (
            <>
              <input
                type="file"
                name="Certificates"
                onChange={handleChange}
                accept=".jpg, .jpeg, .png, .pdf"
                required
              />
              {fileErrors.Certificates && (
                <p className="other-signup-error-message">
                  {fileErrors.Certificates}
                </p>
              )}
            </>
          )}
          {(formData.AccountType === "Advertiser" ||
            formData.AccountType === "Seller") && (
            <>
              <input
                type="file"
                name="TaxationRegistryCard"
                onChange={handleChange}
                accept=".jpg, .jpeg, .png, .pdf"
                required
              />
              {fileErrors.TaxationRegistryCard && (
                <p className="other-signup-error-message">
                  {fileErrors.TaxationRegistryCard}
                </p>
              )}
            </>
          )}
          {/* Accept Terms */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label>
              I accept the{" "}
              <span
                className="terms-link"
                onClick={() => setTermsVisible(true)}
              >
                Terms and Conditions
              </span>
            </label>
          </div>
          {termsError && (
            <p className="other-signup-error-message">{termsError}</p>
          )}
          {/* Submit */}
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        {/* Terms Dialog */}
        {termsVisible && (
          <div className="modal-overlay">
            <div className="terms-modal">
              <h3>Terms and Conditions</h3>
              <p>
                By signing up, you agree to comply with all rules and
                regulations for using our platform. Ensure the uploaded
                documents are accurate and follow the legal standards.
              </p>
              <p>
                You also agree to the processing of your data according to our
                privacy policy.
              </p>
              <button
                className="close-modal-btn"
                onClick={() => setTermsVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherSignup;
