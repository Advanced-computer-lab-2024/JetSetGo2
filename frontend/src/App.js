import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import TouristSignup from "./components/createTourist";
import UpdateTouristPage from "./components/touristUpdate"; // Make sure this component exists
import OtherSignup from "./components/createOther";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tourist-signup" element={<TouristSignup />} />
        <Route path="/tourist-update/:id" element={<UpdateTouristPage />} />
        <Route path="/other-signup" element={<OtherSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
