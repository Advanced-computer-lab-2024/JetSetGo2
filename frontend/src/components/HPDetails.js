import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing the place ID
import { getHistoricalPlaceById } from '../services/HistoricalPlaceService'; // Import the new method

const HPdetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [historicalPlace, setHistoricalPlace] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalPlaceDetails = async () => {
      console.log("Fetched historical place data:", id); // Debugging log
      try {
        const data = await getHistoricalPlaceById(id); // Fetch place details by ID
        console.log("Fetched historical place data:", data); // Debugging log
        setHistoricalPlace(data);
      } catch (err) {
        console.error("Error fetching historical place details:", err);
        setError("Could not fetch the historical place details.");
      }
    };
    fetchHistoricalPlaceDetails();
  }, [id]);

  if (error) return <p>{error}</p>;

  // Generate the map URL based on historical place location coordinates
  let mapSrc = '';
  if (historicalPlace && historicalPlace.location) {
    const locationCoords = historicalPlace.location.split(',');
    const latitude = locationCoords[0].trim();
    const longitude = locationCoords[1].trim();
    mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik&marker=${latitude},${longitude}`;
  }

  return (
    <div>
      {historicalPlace ? (
        <div>
          <h2>{historicalPlace.description}</h2>
          <p>Location: {historicalPlace.location}</p>
          {mapSrc && (
            <iframe
              src={mapSrc}
              width="250"
              height="200"
              style={{ border: 'none' }}
              title={`Map of ${historicalPlace.description}`}
            ></iframe>
          )}
          <p>Opening Hours: {historicalPlace.openingHours}</p>
          <p>Ticket Prices:</p>
          <ul>
            <li>Foreigner: ${historicalPlace.foreignerTicketPrice}</li>
            <li>Native: ${historicalPlace.nativeTicketPrice}</li>
            <li>Student: ${historicalPlace.studentTicketPrice}</li>
          </ul>
          <img src={historicalPlace.pictures} alt={historicalPlace.description} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HPdetails;
