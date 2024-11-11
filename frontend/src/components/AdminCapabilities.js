
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCapabilities = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchComplaints();
  }, []);
  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:8000/complaint/get");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };
  const handleResolveComplaint = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/resolve/${complaintId}`);
      fetchComplaints(); // Refresh complaints after resolving
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  const handlePasswordChange = async () => {
    const adminId = localStorage.getItem("userId");
    console.log("Admin ID:", adminId); // Log adminId to ensure it's not null or undefined
  
    if (!adminId) {
      alert("Admin ID is missing. Please check.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/admin/update-password/${adminId}`, {
        newPassword,
      });
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem('userToken'); // Example: remove token from localStorage
    navigate('/login'); // Redirect to the login page
  };
  const handleReplyChange = (id, value) => {
    setReplyText({ ...replyText, [id]: value });
  };

  const handleReplySubmit = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/reply/${complaintId}`, {
        reply: replyText[complaintId]
      });
      fetchComplaints(); // Refresh complaints after reply is added
      setReplyText({ ...replyText, [complaintId]: "" }); // Clear reply input
    } catch (error) {
      console.error("Error replying to complaint:", error);
    }
  };
  const filteredAndSortedComplaints = complaints
  .filter((complaint) => statusFilter === "all" || complaint.status === statusFilter)
  .sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });



  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px', // Reduced padding for smaller buttons
    fontSize: '16px', // Adjusted font size for smaller buttons
    backgroundColor: '#2d3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, transform 0.3s',
    width: '180px', // Ensures all buttons have equal width
    textAlign: 'center',
  };

  const handleHover = (e) => {
    e.target.style.backgroundColor = '#0056b3';
    e.target.style.transform = 'scale(1.05)';
  };

  const handleLeave = (e) => {
    e.target.style.backgroundColor = '#007BFF';
    e.target.style.transform = 'scale(1)';
  };

  const handleUpdateClick = () => {
    navigate('/admin-update');
  };

  const adminData = {
    UserName: 'Admin',
    
  };

  return (
    <div style={styles.container}>

      {/* Sidebar with Profile */}
      <div style={styles.sidebar}>
        <div style={styles.profileContainer}>
          <img
            src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
            alt="Profile"
            style={styles.profileImage}
          />
          <h2 style={styles.profileName}>{adminData.UserName}</h2>
          <p>Admin</p>
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button> {/* Logout Button */}
          
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.header}>Admin Capabilities</h1>
        <div>
  <label>Filter by Status: </label>
  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    <option value="all">All</option>
    <option value="pending">Pending</option>
    <option value="resolved">Resolved</option>
  </select>

  <label>Sort by Date: </label>
  <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
    {sortOrder === "asc" ? "Oldest First" : "Newest First"}
  </button>
</div>

<h2>Complaints</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.title}</td>
                <td>{complaint.body}</td>
                <td>{complaint.status}</td>
                <td>{new Date(complaint.date).toLocaleDateString()}</td>
                <td style={styles.actionButtons}>
                  {complaint.status === "pending" && (
                    <button style={styles.resolveButton} onClick={() => handleResolveComplaint(complaint._id)}>Resolve</button>
                  )}
                  <div style={styles.replySection}>
                    <input
                      type="text"
                      placeholder="Reply here..."
                      value={replyText[complaint._id] || ""}
                      onChange={(e) => handleReplyChange(complaint._id, e.target.value)}
                      style={styles.replyInput}
                    />
                    <button style={styles.replyButton} onClick={() => handleReplySubmit(complaint._id)}>Send Reply</button>
                    {complaint.reply && <p style={styles.replyText}>Reply: {complaint.reply}</p>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Manage Categories', path: '/category' },
            { label: 'Manage Tags', path: '/TagsManagement' },
            { label: 'Manage Products', path: '/product' },
            { label: 'View Product List', path: '/productList' },
            { label: 'Delete Users', path: '/DeleteUsers' },
            { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
            { label: 'Add an Admin', path: '/AddAdmin' },
            { label: 'Manage Itineraries', path: '/ItinerariesAdmin' },
            { label: 'Manage Activities', path: '/ActivitiesAdmin' },
            { label: 'Manage Historical Places', path: '/HistoricalPlacesAdmin' },
            { label: 'Manage Museums', path: '/MuseumsAdmin' },
            { label: 'Fetch Documents', path: '/fetchdocuments' },
            
          ].map((button) => (
            <button
              key={button.path}
              style={buttonStyle}
              onClick={() => navigate(button.path)}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              {button.label}
            </button>
          ))}
 <button style={styles.button} onClick={() => navigate('/admin-update')}>Change Password</button>          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.passwordInput}
          />
 <button onClick={handlePasswordChange} style={styles.changePasswordButton}>Update Password</button>        </div>
      </div>
    </div>
    
  );
};

// Styles
const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fa', padding: '20px' },
  sidebar: { width: '250px', backgroundColor: '#2d3e50', padding: '20px', borderRadius: '10px', color: '#fff' },
  profileContainer: { textAlign: 'center' },
  profileImage: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px', border: '3px solid #fff' },
  profileName: { fontSize: '22px', fontWeight: 'bold' },
  button: { backgroundColor: '#ff6348', color: '#fff', padding: '10px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginTop: '10px' },
  mainContent: { flex: 1, marginLeft: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' },
  header: { fontSize: '28px', marginBottom: '20px', color: '#333' },
  filterSortContainer: { marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' },
  select: { padding: '5px', borderRadius: '5px', border: '1px solid #ccc' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
  actionButtons: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  resolveButton: { backgroundColor: '#4CAF50', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' },
  replySection: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' },
  replyInput: { width: '60%', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' },
  replyButton: { backgroundColor: '#007BFF', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
  replyText: { fontSize: '14px', marginTop: '5px' },
  buttonsContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' },
  passwordInput: { width: '200px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' },
  changePasswordButton: { backgroundColor: '#ff6348', color: '#fff', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminCapabilities;
