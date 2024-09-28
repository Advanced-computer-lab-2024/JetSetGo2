import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

// Get all activities
export const getActivity = async () => {
   try {
      const response = await axios.get(`${API_URL}/activity/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
   }
};

// Create a new activity
export const createActivity = async (activityData) => {
   try {
      const response = await axios.post(`${API_URL}/activity/add`, activityData);
      return response.data;
   } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
   }
};

// Update an existing activity
export const updateActivity = async (id, updateData) => {
   try {
      const response = await axios.put(`${API_URL}/activity/update`, { id, ...updateData });
      return response.data;
   } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
   }
};

// Delete an activity
export const deleteActivity = async (id) => {
   try {
      const response = await axios.delete(`${API_URL}/activity/delete`, { data: { id } });
      return response.data;
   } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
   }
};