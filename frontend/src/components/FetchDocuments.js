import React, { useEffect, useState } from "react";

const OthersListPage = () => {
  const [sellers, setSellers] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const sellerResponse = await fetch("http://localhost:8000/Seller/get");
        const adverResponse = await fetch(
          "http://localhost:8000/home/adver/get"
        );
        const tourGuideResponse = await fetch(
          "http://localhost:8000/TourGuide/get"
        );

        if (!sellerResponse.ok || !adverResponse.ok || !tourGuideResponse.ok) {
          throw new Error("Failed to fetch data from one or more sources");
        }

        const sellers = await sellerResponse.json();
        const advertisers = await adverResponse.json();
        const tourGuides = await tourGuideResponse.json();

        setSellers(sellers);
        setAdvertisers(advertisers);
        setTourGuides(tourGuides);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAcceptSeller = async (sellerId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/Seller/acceptSeller/${sellerId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept seller");
      }
      setSellers((prevSellers) =>
        prevSellers.filter((seller) => seller._id !== sellerId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectSeller = (sellerId) => {
    setSellers((prevSellers) =>
      prevSellers.filter((seller) => seller._id !== sellerId)
    );
  };

  const handleAcceptAdver = async (adverId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/home/adver/acceptAdver/${adverId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept advertiser");
      }
      setAdvertisers((prevAdvers) =>
        prevAdvers.filter((adver) => adver._id !== adverId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectAdver = (adverId) => {
    setAdvertisers((prevAdvers) =>
      prevAdvers.filter((adver) => adver._id !== adverId)
    );
  };

  const handleAcceptTourGuide = async (tourGuideId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/TourGuide/acceptTourguide/${tourGuideId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept tour guide");
      }
      setTourGuides((prevTourGuides) =>
        prevTourGuides.filter((tourGuide) => tourGuide._id !== tourGuideId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectTourGuide = (tourGuideId) => {
    setTourGuides((prevTourGuides) =>
      prevTourGuides.filter((tourGuide) => tourGuide._id !== tourGuideId)
    );
  };

  const renderSellerAdverTable = (users, title, handleAccept, handleReject) => {
    if (!users.length) return null;

    return (
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID Document</th>
              <th>Taxation Registry Card</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.UserName || "N/A"}</td>
                <td>{user.Email || "N/A"}</td>
                <td>
                  {user.IDDocument ? (
                    <a
                      href={`http://localhost:8000/uploads/documents/${user.IDDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ID Document
                    </a>
                  ) : (
                    "No document"
                  )}
                </td>
                <td>
                  {user.TaxationRegistryCard ? (
                    <a
                      href={`http://localhost:8000/uploads/documents/${user.TaxationRegistryCard}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Taxation Registry Card
                    </a>
                  ) : (
                    "No taxation registry card"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleAccept(user._id)}
                    style={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTourGuideTable = (users) => {
    if (!users.length) return null;

    return (
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionTitle}>Tour Guides</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID Document</th>
              <th>Certificates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.UserName || "N/A"}</td>
                <td>{user.Email || "N/A"}</td>
                <td>
                  {user.IDDocument ? (
                    <a
                      href={`http://localhost:8000/uploads/documents/${user.IDDocument}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ID Document
                    </a>
                  ) : (
                    "No document"
                  )}
                </td>
                <td>
                  {user.Certificates ? (
                    <a
                      href={`http://localhost:8000/uploads/documents/${user.Certificates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificates
                    </a>
                  ) : (
                    "No certificates"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleAcceptTourGuide(user._id)}
                    style={styles.acceptButton}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectTourGuide(user._id)}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p style={styles.loading}>Loading...</p>;
    }

    if (error) {
      return <p style={styles.error}>{error}</p>;
    }

    return (
      <div style={styles.content}>
        {renderSellerAdverTable(
          sellers,
          "Sellers",
          handleAcceptSeller,
          handleRejectSeller
        )}
        {renderSellerAdverTable(
          advertisers,
          "Advertisers",
          handleAcceptAdver,
          handleRejectAdver
        )}
        {renderTourGuideTable(tourGuides)}
      </div>
    );
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>All Users</h1>
      {renderContent()}
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f9",
  },
  pageTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  sectionContainer: {
    marginBottom: "40px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "8px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    color: "#4A90E2",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableData: {
    padding: "10px",
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    marginRight: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#888",
  },
  error: {
    color: "#f44336",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  content: {
    padding: "20px",
  },
};

export default OthersListPage;
