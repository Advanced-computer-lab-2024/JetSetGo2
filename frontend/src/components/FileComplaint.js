import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FileComplaint = () => {
    const location = useLocation();
    const touristId = location.state?.touristId; // Access the passed touristId
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [date, setDate] = useState("");

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
        <div style={styles.container}>
            <h2 style={styles.header}>File a Complaint</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={styles.input}
                />
                <textarea
                    placeholder="Describe your problem"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton}>
                    Submit Complaint
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f7f7f7",
    },
    header: {
        textAlign: "center",
        fontSize: "24px",
        color: "#333",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginBottom: "15px",
    },
    textarea: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        marginBottom: "15px",
        height: "100px",
    },
    submitButton: {
        padding: "10px",
        fontSize: "16px",
        color: "#fff",
        backgroundColor: "#28a745",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default FileComplaint;
