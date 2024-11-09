import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing the place ID
import { getHistoricalPlaceById } from '../services/HistoricalPlaceService'; // Import the new method

const HPdetails = () => {
   const { id } = useParams(); // Get the ID from the URL
   const [historicalPlace, setHistoricalPlace] = useState(null);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchHistoricalPlaceDetails = async () => {
            console.log("Fetched activity data:", id); // Debugging log
         try {
            const data = await getHistoricalPlaceById(id); // Fetch place details by ID
            console.log("Fetched activity data:", id); // Debugging log
            setHistoricalPlace(data);
         } catch (err) {
            console.error("Error fetching historical place details:", err);
            setError("Could not fetch the historical place details.");
         }
      };
      fetchHistoricalPlaceDetails();
   }, [id]);

   if (error) return <p>{error}</p>;

   return (
      <div>
         {historicalPlace ? (
            <div>
               <h2>{historicalPlace.description}</h2>
               <p>Location: {historicalPlace.location}</p>
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
