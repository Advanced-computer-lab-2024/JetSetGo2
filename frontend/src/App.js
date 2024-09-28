// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import SchemaTourFront from './components/schemaTourFront'; 

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Removed the trailing space */}
          <Route path="/SchemaTourFront" element={<SchemaTourFront />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
