import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivityCRUD from "./components/ActivityCRUD"; // Import ActivityCRUD component
import HistoricalplaceCRUD from "./components/HistoricalplaceCRUD";
import MuseumCRUD from "./components/MuseumCRUD";
import SchemaTourFront from "./components/schemaTourFront";
import HomePage from "./components/HomePage";
import TouristSignup from "./components/createTourist";
import UpdateTouristPage from "./components/touristUpdate"; // Make sure this component exists
import OtherSignup from "./components/createOther";

function App() {
  const [selectedTouristId, setSelectedTouristId] = useState(null); // State to hold selected tourist ID

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tourist-signup"
            element={
              <TouristSignup setSelectedTouristId={setSelectedTouristId} />
            }
          />
          <Route
            path="/tourist-update"
            element={
              <UpdateTouristPage selectedTouristId={selectedTouristId} />
            }
          />
          <Route path="/other-signup" element={<OtherSignup />} />
          <Route path="/activities" element={<ActivityCRUD />} />
          <Route path="/historicalplaces" element={<HistoricalplaceCRUD />} />
          <Route path="/museums" element={<MuseumCRUD />} />
          <Route path="/SchemaTourFront" element={<SchemaTourFront />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
