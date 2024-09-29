import React, { useState, useEffect } from 'react';
import '../App.css'
import { createTourismGovernor } from '../services/AdminService'; 

const TourismGovernorComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const governorData = { username, password };
            const response = await createTourismGovernor(governorData);
            setMessage('Tourism Governor created successfully!');
            setUsername('');
            setPassword('');
        } catch (error) {
            setMessage('Error creating Tourism Governor. Please try again.');
            console.error("Error creating Tourism Governor:", error);
        }
    };

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
        </div>
    );
}

export default TourismGovernorComponent;