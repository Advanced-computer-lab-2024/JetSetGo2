import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Get all itineraries
export const getItineraries = async () => {
   try {
      const response = await axios.get(`${API_URL}/readTour`);
      console.log(response.data); // Log the response for debugging
      return response.data;
   } catch (error) {
      console.error("Error fetching itineraries:", error); // Log the error for troubleshooting
      throw error;
   }
};
