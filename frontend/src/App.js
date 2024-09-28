import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ActivityCRUD from './components/ActivityCRUD'; // Import ActivityCRUD component
import HistoricalplaceCRUD from './components/HistoricalplaceCRUD';
import MuseumCRUD from './components/MuseumCRUD';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Use element prop to render the component */}
          <Route path="/activities" element={<ActivityCRUD />} />
          <Route path="/historicalplaces" element={<HistoricalplaceCRUD />} />
          <Route path="/museums" element={<MuseumCRUD />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
