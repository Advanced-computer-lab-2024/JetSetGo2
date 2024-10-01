import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivityCRUD from "./components/ActivityCRUD"; // Import ActivityCRUD component
import HistoricalplaceCRUD from "./components/HistoricalplaceCRUD";
import MuseumCRUD from "./components/MuseumCRUD";
import SchemaTourFront from "./components/schemaTourFront";
import HomePage from "./components/HomePage";
import TouristSignup from "./components/createTourist";
import UpdateTouristPage from "./components/touristUpdate"; // Make sure this component exists
import OtherSignup from "./components/createOther";
import CategoryCRUD from "./components/CategoryCRUD";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tourist-signup" element={<TouristSignup />} />
          <Route path="/tourist-update/:id" element={<UpdateTouristPage />} />
          <Route path="/other-signup" element={<OtherSignup />} />
          <Route path="/activities" element={<ActivityCRUD />} />
          <Route path="/historicalplaces" element={<HistoricalplaceCRUD />} />
          <Route path="/museums" element={<MuseumCRUD />} />
          <Route path="/SchemaTourFront" element={<SchemaTourFront />} />
          <Route path="/category" element={<CategoryCRUD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
