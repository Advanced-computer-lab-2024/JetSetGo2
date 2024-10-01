// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdvertiserForm from './components/Create'; 
import  AdvertiserManagement from './components/listup'; 


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AdvertiserForm />} />
        <Route path="/list" element={<AdvertiserManagement />} />
        <Route path= "/getTourist/:id" element={<AdvertiserManagement/>} />
      </Routes>
    </Router>
  );
};

export default App;