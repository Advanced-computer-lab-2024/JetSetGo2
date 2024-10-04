import axios from 'axios';

const API_URL = 'http://localhost:8000';
export const deleteTourist = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Tourist/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw error;
    }
};