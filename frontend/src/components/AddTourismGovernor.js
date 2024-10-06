import React, { useState, useEffect } from 'react'; 
import '../App.css';
import { createTourismGovernor, deleteTourismGovernor } from '../services/TourismService'; 

const TourismGovernorComponent = () => {
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

    return (
        <div>
            <h1>Add Tourism Governor</h1>
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
                <button type="submit">Add Tourism Governor</button>
            </form>
            {message && <p>{message}</p>}

            <h2>Tourism Governor List</h2>
            <ul>
                {governors.map((governor) => (
                    <li key={governor._id}>
                        {governor.username}
                        <button onClick={() => handleDelete(governor._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TourismGovernorComponent;
