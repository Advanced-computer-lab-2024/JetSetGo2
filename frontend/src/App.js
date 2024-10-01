// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTourGuide from './components/CreateTourGuide';
import TourGuideDetails from './components/TourGuideDetails';
import EditTourGuide from './components/EditTourGuide';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateTourGuide />} />
        <Route path="/tour-guide" element={<TourGuideDetails />} />
        <Route path="/edit-tour-guide/:id" element={<EditTourGuide />} />
      </Routes>
    </Router>
  );
};

export default TourGuideDetails;
