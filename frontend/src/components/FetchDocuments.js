import React, { useEffect, useState } from "react";

const OthersListPage = () => {
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all "Others" after signup
  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/home/other/getOther"
        ); // Replace with your actual backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setOthers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOthers();
  }, []);

  // Render Loading, Error, or Data
  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!others.length) {
      return <p>No users found.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Account Type</th>
            <th>ID Document</th>
            <th>Certificates</th>
            <th>Taxation Registry Card</th>
          </tr>
        </thead>
        <tbody>
          {others.map((user) => (
            <tr key={user._id}>
              <td>{user.UserName || "N/A"}</td>
              <td>{user.Email || "N/A"}</td>
              <td>{user.AccountType || "N/A"}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>All "Other" Users</h1>
      {renderContent()}
    </div>
  );
};

export default OthersListPage;
