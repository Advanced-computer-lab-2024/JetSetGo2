import axios from 'axios';

const API_URL = 'http://localhost:8000'; 


export const getitenbyID = async (id) => {
    try {
        console.log(id);
       const response = await axios.get(`${API_URL}/itinerary/getIten/${id}`);
       return response.data;
    } catch (error) {
       console.error("Error fetching Museum:", error);
       throw error;
    }
 };