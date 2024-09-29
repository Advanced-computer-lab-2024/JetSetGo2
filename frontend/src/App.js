import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddAdmin from './components/AddAdmin'; // Import the AddAdmin component
import AddTourismGovernor from './components/AddTourismGovernor'; // Import the AddTourismGovernor component

// Home Component
function Home() {
    return (
        <div>
            <h1>Welcome to the Admin Dashboard</h1>
        </div>
    );
}

// Main App Component with Routing
function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/add-admin">Add Admin</Link></li>
                    <li><Link to="/add-tourism-governor">Add Tourism Governor</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-admin" element={<AddAdmin />} />
                <Route path="/add-tourism-governor" element={<AddTourismGovernor />} />
            </Routes>
        </Router>
    );
}

export default App;
