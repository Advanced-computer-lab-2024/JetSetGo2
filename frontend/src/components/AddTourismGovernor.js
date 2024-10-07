import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { createTourismGovernor, deleteTourismGovernor } from '../services/TourismService'; 

const TourismGovernorComponent = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [governors, setGovernors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const governorData = { username, password };
            const response = await createTourismGovernor(governorData);
            setMessage('Tourism Governor created successfully!');
            setUsername('');
            setPassword('');
            fetchGovernors(); // Refresh the list of governors after adding a new one
        } catch (error) {
            setMessage('Error creating Tourism Governor. Please try again.');
            console.error("Error creating Tourism Governor:", error);
        }
    };

    // Fetch all governors from the backend
    const fetchGovernors = async () => {
        try {
            const response = await fetch('http://localhost:8000/tourism/get');
            const data = await response.json();
            setGovernors(data);
        } catch (error) {
            console.error("Error fetching Tourism Governors:", error);
            setMessage('Error fetching Tourism Governor list.');
        }
    };

    // Handle deletion of a governor
    const handleDelete = async (id) => {
        try {
            const response = await deleteTourismGovernor(id);
            setMessage('Tourism Governor deleted successfully!');
            fetchGovernors(); // Refresh the list after deletion
        } catch (error) {
            setMessage('Error deleting Tourism Governor. Please try again.');
            console.error("Error deleting Tourism Governor:", error);
        }
    };

    // Fetch the governors when the component is first rendered
    useEffect(() => {
        fetchGovernors();
    }, []);

    // Button styles for admin navigation
    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#2d3e50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s',
        width: '180px',
        textAlign: 'center',
    };

    const handleHover = (e) => {
        e.target.style.backgroundColor = '#0056b3';
        e.target.style.transform = 'scale(1.05)';
    };

    const handleLeave = (e) => {
        e.target.style.backgroundColor = '#2d3e50';
        e.target.style.transform = 'scale(1)';
    };

    return (
        <div style={styles.container}>
            {/* Sidebar with Profile and Admin Buttons */}
            <div style={styles.sidebar}>
                <div style={styles.profileContainer}>
                    <img
                        src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
                        alt="Profile"
                        style={styles.profileImage}
                    />
                    <h2 style={styles.profileName}>Admin</h2>
                    <p>Admin</p>
                    <button onClick={() => navigate('/adminCapabilities')} style={styles.button}>
                        Admin Home
                    </button>
                    
                </div>

                <div style={{ marginTop: '20px' }}>
                    {[
                        { label: 'Manage Categories', path: '/category' },
                        { label: 'Manage Tags', path: '/TagsManagement' },
                        { label: 'Manage Products', path: '/product' },
                        { label: 'View Product List', path: '/productList' },
                        { label: 'Delete Users', path: '/DeleteUsers' },
                        { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
                        { label: 'Add an Admin', path: '/AddAdmin' },
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
                </div>
            </div>

            {/* Main Content - Add and Manage Tourism Governors */}
            <div style={styles.mainContent}>
                <h1 style={styles.header}>Add Tourism Governor</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.submitButton}>Add Tourism Governor</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}

                <h2 style={styles.header}>Tourism Governor List</h2>
                <ul style={styles.list}>
                    {governors.map((governor) => (
                        <li key={governor._id} style={styles.listItem}>
                            {governor.username}
                            <button onClick={() => handleDelete(governor._id)} style={styles.deleteButton}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f7f8fa',
        padding: '20px',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#2d3e50',
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
    },
    profileContainer: {
        textAlign: 'center',
    },
    profileImage: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        marginBottom: '15px',
        border: '3px solid #fff',
    },
    profileName: {
        fontSize: '22px',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#ff6348',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
    },
    mainContent: {
        flex: 1,
        marginLeft: '30px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        marginBottom: '30px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '8px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    message: {
        color: 'green',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
    },
    deleteButton: {
        backgroundColor: '#ff6348',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
    },
};

export default TourismGovernorComponent;
