import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FileComplaint.css";

const FileComplaint = () => {
  const location = useLocation();
  const touristId = location.state?.touristId;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/complaint/add", {
        touristId,
        title,
        body,
        date,
      });
      alert("Complaint filed successfully!");
    } catch (error) {
      console.error("Error filing complaint:", error);
      alert("Failed to file complaint. Please try again.");
    }
  };

  return (
    <div className="file-complaint-container">
        <button className="reply-button" onClick={() => navigate(-1)}>
        Back
      </button>
                <h3 className="total-revenue1">File Complaint</h3>

      

      <form onSubmit={handleSubmit} className="file-complaint-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="file-complaint-input"
        />
        <textarea
          placeholder="Describe your problem"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="file-complaint-textarea"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="file-complaint-input"
        />
        <button type="submit" className="reply-button">
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default FileComplaint;
