import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ActivityCRUD from "./components/ActivityCRUD"; // Import ActivityCRUD component
import HistoricalplaceCRUD from "./components/HistoricalplaceCRUD";
import MuseumCRUD from "./components/MuseumCRUD";
import SchemaTourFront from "./components/schemaTourFront";
import HomePage from "./components/HomePage";
import TouristSignup from "./components/createTourist";
import UpdateTouristPage from "./components/touristUpdate"; // Make sure this component exists
import OtherSignup from "./components/createOther";
import TagsManagement from './components/TagsManagement';
import CreateTourGuide from './components/CreateTourGuide';
import TourGuideDetails from './components/TourGuideDetails';
import EditTourGuide from './components/EditTourGuide';
import CategoryCRUD from "./components/CategoryCRUD";
import CreateTag from "./components/CreateTag";
import AdvertiserForm from './components/Create'; 
import  AdvertiserManagement from './components/listup'; 
import CreateSeller from './components/CreateSeller';
import SellerDetails from './components/SellerDetails';

function App() {
  const [selectedTouristId, setSelectedTouristId] = useState(null); // State to hold selected tourist ID
  const [selectedTourGuideId, setselectedTourGuideId] = useState(null);

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
          <Route path="/AdvirtiserMain" element={<AdvertiserForm />} />
        <Route path="/list" element={<AdvertiserManagement />} />
          <Route path="/CreateTourGuide" element={<CreateTourGuide setselectedTourGuideId={setselectedTourGuideId} />} />
          <Route path="/editTourGuide" element={<EditTourGuide selectedTourGuideId={selectedTourGuideId}/>} />
          <Route path="/tour-guide" element={<TourGuideDetails  selectedTourGuideId={selectedTourGuideId}/>} />
          <Route path="/tourist-signup" element={<TouristSignup />} />
          <Route path="/tourist-update/:id" element={<UpdateTouristPage />} />
          <Route path="/other-signup" element={<OtherSignup />} />
          <Route path="/activities" element={<ActivityCRUD />} />
          <Route path="/historicalplaces" element={<HistoricalplaceCRUD />} />
          <Route path="/museums" element={<MuseumCRUD />} />
          <Route path="/SchemaTourFront" element={<SchemaTourFront  selectedTourGuideId={selectedTourGuideId}/>} />
          <Route path="/TagsManagement" element={<TagsManagement />} />
          <Route path="/category" element={<CategoryCRUD />} />
          <Route path="/CreateTag" element={<CreateTag />} />
          <Route path="/CreateSeller" element={<CreateSeller />} />
          <Route path="/seller-details" element={<SellerDetails />} />
        
        </Routes>
      </div>
    </Router>
  );
};


export default App;
