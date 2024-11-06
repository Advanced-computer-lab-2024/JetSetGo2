import axios from 'axios';

const API_URL = 'http://localhost:8000';
export const deleteAdver = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/home/adver/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw error;
    }
};