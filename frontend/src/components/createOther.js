import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB file size limit

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
    <div style={styles.container}>
      <h2 style={styles.header}>Sign Up for Other Users</h2>
      {error && <p style={styles.error}>{error}</p>} {/* Show error message */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>UserName:</label>
          <input
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Account Type:</label>
          <select
            name="AccountType"
            value={formData.AccountType}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Account Type</option>
            <option value="Advertiser">Advertiser</option>
            <option value="TourGuide">Tour Guide</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>ID Document:</label>
          <input
            type="file"
            name="IDDocument"
            onChange={handleChange}
            style={styles.input}
            accept=".jpg, .jpeg, .png, .pdf"
            required
          />
          {fileErrors.IDDocument && (
            <p style={styles.error}>{fileErrors.IDDocument}</p>
          )}
        </div>

        {/* Conditional rendering for Certificates and TaxationRegistryCard */}
        {formData.AccountType === "TourGuide" && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Certificates:</label>
            <input
              type="file"
              name="Certificates"
              onChange={handleChange}
              style={styles.input}
              accept=".jpg, .jpeg, .png, .pdf"
              required
            />
            {fileErrors.Certificates && (
              <p style={styles.error}>{fileErrors.Certificates}</p>
            )}
          </div>
        )}

        {(formData.AccountType === "Advertiser" ||
          formData.AccountType === "Seller") && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Taxation Registry Card:</label>
            <input
              type="file"
              name="TaxationRegistryCard"
              onChange={handleChange}
              style={styles.input}
              accept=".jpg, .jpeg, .png, .pdf"
              required
            />
            {fileErrors.TaxationRegistryCard && (
              <p style={styles.error}>{fileErrors.TaxationRegistryCard}</p>
            )}
          </div>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            &nbsp; I accept the{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setTermsVisible(true)} // Open the dialog on click
            >
              Terms and Conditions
            </span>
          </label>
          {termsError && <p style={styles.error}>{termsError}</p>}
        </div>

        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
      {/* Terms and Conditions Dialog */}
      {termsVisible && (
        <dialog open style={styles.dialog}>
          <h3>Terms and Conditions</h3>
          <p>
            By signing up and using our platform, you agree to the following
            terms and conditions. Your personal information, including but not
            limited to your name, email address, and any uploaded documents,
            will be stored and processed securely in accordance with our privacy
            policy. You are responsible for maintaining the accuracy and
            confidentiality of your account details. Any content you upload,
            including documents and images, must comply with legal and ethical
            standards, and you agree not to misuse our platform for any
            unauthorized or harmful activities. We reserve the right to update
            or modify these terms at any time, and it is your responsibility to
            review them periodically. Continued use of the platform following
            any changes signifies your acceptance of the updated terms. If you
            do not agree to these terms, please refrain from using our services.
          </p>
          <button
            style={styles.closeButton}
            onClick={() => setTermsVisible(false)}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Roboto', sans-serif",
  },
  header: {
    color: "#fff",
    fontSize: "30px",
    marginBottom: "20px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "400px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  dialog: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "500px",
    textAlign: "center",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default OtherSignup;
