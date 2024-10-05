import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Get all activities
export const readGuide = async () => {
   try {
      const response = await axios.get(`${API_URL}/TourismTags/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching tourismgovernertags:", error);
      throw error;
   }
};

// Create a new activity
export const createTags = async (tagData) => {
   try {
      const response = await axios.post(`${API_URL}/TourismTags/add`, tagData);
      return response.data;
   } catch (error) {
      console.error("Error creating tourismgovernertags:", error);
      throw error;
   }
};


