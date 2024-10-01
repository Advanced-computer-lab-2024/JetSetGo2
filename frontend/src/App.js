
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivityCRUD from './components/ActivityCRUD'; // Import ActivityCRUD component
import HistoricalplaceCRUD from './components/HistoricalplaceCRUD';
import MuseumCRUD from './components/MuseumCRUD';
import SchemaTourFront from './components/schemaTourFront'; 
import AddAdmin from './components/AddAdmin'; 
import AddTourismGovernor from './components/AddTourismGovernor'; 
import ViewMuseums from './components/ViewMuseums'; 
import ViewHistoricalPlaces from './components/ViewHistoricalPlaces'; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Use element prop to render the component */}
          <Route path="/activities" element={<ActivityCRUD />} />
          <Route path="/historicalplaces" element={<HistoricalplaceCRUD />} />
          <Route path="/museums" element={<MuseumCRUD />} />
          <Route path="/SchemaTourFront" element={<SchemaTourFront />} />
          <Route path="/AddAdmin" element={<AddAdmin />} />
          <Route path="/AddTourismGovernor" element={<AddTourismGovernor />} />
          <Route path="/ViewMuseums" element={<ViewMuseums />} />
          <Route path="/ViewHistoricalPlaces" element={<ViewHistoricalPlaces />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
