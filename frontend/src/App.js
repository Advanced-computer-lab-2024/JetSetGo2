import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateSeller from './components/CreateSeller';
import SellerDetails from './components/SellerDetails';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<CreateSeller />} />
                    <Route path="/seller-details" element={<SellerDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
