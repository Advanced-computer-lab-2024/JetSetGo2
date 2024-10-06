import React, { useState, useEffect } from 'react';
import '../App.css'
import { createAdmin, deleteAdmin } from '../services/AdminService'; 
const AdminComponent = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [admins, setAdmins] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const adminData = { username, password };
            const response = await createAdmin(adminData);
            setMessage('Admin created successfully!');
            setUsername('');
            setPassword('');
            fetchAdmins();
        } catch (error) {
            setMessage('Error creating admin. Please try again.');
            console.error("Error creating admin:", error);
        }
    };

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:8000/admin/get');
            const data = await response.json();
            setAdmins(data);
        } catch (error) {
            console.error("Error fetching admins:", error);
            setMessage('Error fetching admin list.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteAdmin(id);
            setMessage('Admin deleted successfully!');
            fetchAdmins();
        } catch (error) {
            setMessage('Error deleting admin. Please try again.');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div>
            <h1>Add Admin</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Admin</button>
            </form>
            {message && <p>{message}</p>}

            <h2>Admin List</h2>
            <ul>
                {admins.map((admin) => (
                    <li key={admin._id}>
                        {admin.username}
                        <button onClick={() => handleDelete(admin._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminComponent;