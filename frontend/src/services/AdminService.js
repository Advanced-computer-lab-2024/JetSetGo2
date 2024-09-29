import axios from 'axios';

const API_URL = 'http://localhost:8000'; 


export const createAdmin = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/add`, adminData);
        return response.data;
     } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
     }
};

export const createTourismGovernor = async (governorData) => {
   try {
     const response = await axios.post(`${API_URL}/tourism/add`, governorData);  // Corrected path
     return response.data;
   } catch (error) {
     console.error("Error creating Tourism Governor:", error);
     throw error;
   }
};

export const deleteAdmin = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/admin/delete/${id}`);
      return response.data;
    } catch (error) {
       console.error("Error deleting activity:", error);
       throw error;
    }
 };