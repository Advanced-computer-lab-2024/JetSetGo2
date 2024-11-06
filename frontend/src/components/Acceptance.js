import React from "react";

const AdminApprovalPage = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
    loader: {
      border: "8px solid #f3f3f3",
      borderRadius: "50%",
      borderTop: "8px solid #3498db",
      width: "60px",
      height: "60px",
      animation: "spin 2s linear infinite",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      margin: "20px 0",
      color: "#333",
    },
    message: {
      fontSize: "16px",
      color: "#555",
      maxWidth: "400px",
      lineHeight: "1.6",
      textAlign: "center",
      marginBottom: "20px",
    },
    contact: {
      fontSize: "14px",
      color: "#777",
    },
    link: {
      color: "#3498db",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <h1 style={styles.title}>Your account is under review</h1>
      <p style={styles.message}>
        Please wait while the admin approves your account. You will be notified
        once the approval process is completed.
      </p>
      <p style={styles.contact}>
        For assistance, you can contact us at{" "}
        <a href="mailto:support@example.com" style={styles.link}>
          support@example.com
        </a>
      </p>
    </div>
  );
};

// CSS keyframes for the loader (inline style can't handle this part)
const styleSheet = document.styleSheets[0];
const keyframes = `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;

styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default AdminApprovalPage;
