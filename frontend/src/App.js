// src/App.js
import React, { useState } from 'react';
import TourForm from './components/TourForm';
import TourList from './components/TourList';

const App = () => {
    const [selectedTour, setSelectedTour] = useState(null);
    const [refreshTours, setRefreshTours] = useState(false);

    return (
        <div>
            <h1>Tour Guide Management</h1>
            <TourForm refreshTours={() => setRefreshTours(!refreshTours)} />
            <TourList setSelectedTour={setSelectedTour} refreshTours={refreshTours} />
        </div>
    );
};

export default App;
