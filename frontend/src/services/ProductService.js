import axios from 'axios';

const API_URL = 'http://localhost:8000/product'; // Adjust the base URL as needed
const API_URL2 = 'http://localhost:8000/Seller';
const API_URL3 = 'http://localhost:8000/home/tourist';
const API_URL4 = 'http://localhost:8000/admin';

// Get all products
export const getProducts = async () => {
   try {
      const response = await axios.get(`${API_URL}/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
   }
};

export const getAdmins = async () => {
   try {
      const response = await axios.get(`${API_URL4}/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
   }
};

export const getSellers = async () => {
   try {
      const response = await axios.get(`${API_URL2}/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
   }
};

// Create a new product
export const createProduct = async (productData) => {
   try {
      const response = await axios.post(`${API_URL}/add`, productData);
      return response.data;
   } catch (error) {
      console.error("Error creating product:", error);
      throw error;
   }
};

// Update an existing product
export const updateProduct = async (id, updateData) => {
   try {
      const response = await axios.put(`${API_URL}/update/${id}`, updateData);
      return response.data;
   } catch (error) {
      console.error("Error updating product:", error);
      throw error;
   }
};

// Delete a product
export const deleteProduct = async (id) => {
   try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
   }
};

export const buyProduct = async (touristId,productId) => {
   try {
      const response = await axios.delete(`${API_URL}/buyProduct/${touristId}/${productId}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
   }
};





