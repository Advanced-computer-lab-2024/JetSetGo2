// src/components/TourGuideDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TourGuideDetails = () => {
  const { id } = useParams();
  const [tourGuide, setTourGuide] = useState(null);

  useEffect(() => {
    const fetchTourGuide = async () => {
      const response = await axios.get(`http://localhost:8004/TourGuide/get/${id}`);
      setTourGuide(response.data);
    };
    fetchTourGuide();
  }, [id]);

  if (!tourGuide) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tour Guide Details</h2>
      <ul>
        {Object.entries(tourGuide).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
      <Link to={`/edit-tour-guide/${id}`}>Edit</Link>
    </div>
  );
};

export default TourGuideDetails;
