import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Get all activities
export const getHistoricalPlace = async () => {
   try {
      const response = await axios.get(`${API_URL}/historicalPlace/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching historicalPlace:", error);
      throw error;
   }
};

// Create a new activity
export const createHistoricalPlace = async (activityData) => {
   try {
      const response = await axios.post(`${API_URL}/historicalPlace/add`, activityData);
      return response.data;
   } catch (error) {
      console.error("Error creating historicalPlace:", error);
      throw error;
   }
};

// Update an existing activity
export const updateHistoricalPlace = async (id, updateData) => {
   try {
      const response = await axios.put(`${API_URL}/historicalPlace/update/${id}`, updateData);
      return response.data;
   } catch (error) {
      console.error("Error updating historicalPlace:", error);
      throw error;
   }
};

// Delete an activity
export const deleteHistoricalPlace = async (id) => {
   try {
      const response = await axios.delete(`${API_URL}/historicalPlace/delete/${id}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting historicalPlace:", error);
      throw error;
   }
};
