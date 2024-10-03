import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update this URL if needed

// Get all categories
export const getCategory = async () => {
   try {
      const response = await axios.get(`${API_URL}/category/get`);
      return response.data;
   } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
   }
};

// Create a new category
export const createCategory = async (categoryData) => {
   try {
      const response = await axios.post(`${API_URL}/category/add`, categoryData);
      return response.data;
   } catch (error) {
      console.error("Error creating category:", error);
      throw error;
   }
};

// Update an existing category
export const updateCategory = async (id, updateData) => {
   try {
      const response = await axios.put(`${API_URL}/category/update/${id}`, updateData); // Ensure the ID is appended to the URL
      return response.data;
   } catch (error) {
      console.error("Error updating category:", error);
      throw error;
   }
};

// Delete a category
export const deleteCategory = async (id) => {
   try {
      const response = await axios.delete(`${API_URL}/category/delete/${id}`); // Ensure the ID is appended to the URL
      return response.data;
   } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
   }
};
