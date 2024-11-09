import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Get all activities
export const getMuseum = async () => {
   try {
      const response = await axios.get(`${API_URL}/museum/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching Museum:", error);
      throw error;
   }
};

// Get museum by ID
export const getMuseumById = async (id) => {
   try {
      const response = await axios.get(`${API_URL}/museum/museum/${id}`);
      return response.data;
   } catch (error) {
      console.error("Error fetching Museum by ID:", error);
      throw error;
   }
};
// Create a new activity
export const createMuseum = async (activityData) => {
   try {
      const response = await axios.post(`${API_URL}/museum/add`, activityData);
      return response.data;
   } catch (error) {
      console.error("Error creating Museum:", error);
      throw error;
   }
};

// Update an existing activity
export const updateMuseum = async (id, updateData) => {
   try {
      const response = await axios.put(`${API_URL}/museum/update/${id}`, updateData);
      return response.data;
   } catch (error) {
      console.error("Error updating Museum:", error);
      throw error;
   }
};

// Delete an activity
export const deleteMuseum = async (id) => {
   try {
      const response = await axios.delete(`${API_URL}/museum/delete/${id}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting Museum:", error);
      throw error;
   }
};
