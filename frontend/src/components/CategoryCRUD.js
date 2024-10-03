import React, { useState, useEffect } from 'react';
import '../App.css';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../services/CategoryService'; // Ensure you have these service functions defined

const CategoryCRUD = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
  });
  const [editData, setEditData] = useState(null);

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await getCategory(); // Fetch categories from the backend
      setCategories(data);               // Update state with fetched data
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Handle form input change
  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for creating a new category
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory(formData);
      setMessage('Category created successfully!');
      resetCreateForm();
      fetchCategories(); // Fetch updated categories
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Error occurred while creating the category';
      setMessage(errorMessage);
      console.error('Error:', error);
    }
  };

  // Handle form submission for updating an existing category
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData) return; // Return if there's no editData

    try {
      // Send the current state of editData with the ID
      await updateCategory(editData._id, editData);
      setMessage('Category updated successfully!');
      resetEditForm();
      fetchCategories(); // Fetch updated categories
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : 'Error occurred while updating the category.';
      setMessage(errorMessage);
      console.error(error);
    }
  };

  // Handle category deletion
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setMessage('Category deleted successfully!');
      fetchCategories(); // Fetch updated categories
    } catch (error) {
      setMessage('Error deleting category.');
      console.error(error);
    }
  };

  // Populate form with data for editing
  const handleEdit = (category) => {
    setEditData(category);
  };

  // Reset form for creating
  const resetCreateForm = () => {
    setFormData({ name: '' });
  };

  // Reset form for editing
  const resetEditForm = () => {
    setEditData(null);
  };

  return (
    <div>
      <h1>Category Management</h1>

      {/* Display success/error message */}
      {message && <p className="message">{message}</p>}

      {/* Form for creating a new category */}
      <section className="form-section">
        <h2>Create New Category</h2>
        <form onSubmit={handleCreateSubmit}>
          <label>Name:
            <input type="text" name="name" value={formData.name} onChange={(e) => handleChange(e, setFormData)} required />
          </label>
          <button type="submit">Create Category</button>
        </form>
      </section>

      {/* Form for editing an existing category */}
      {editData && (
        <section className="form-section">
          <h2>Edit Category</h2>
          <form onSubmit={handleEditSubmit}>
            <label>Name:
              <input type="text" name="name" value={editData.name} onChange={(e) => handleChange(e, setEditData)} required />
            </label>
            <button type="submit">Update Category</button>
            <button type="button" onClick={resetEditForm}>Cancel Edit</button>
          </form>
        </section>
      )}

      {/* List of categories */}
      <section className="category-list">
        <h2>Category List</h2>
        {categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category._id} className="category-item">
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button onClick={() => handleEdit(category)}>Edit</button>
                  <button onClick={() => handleDelete(category._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories found.</p>
        )}
      </section>
    </div>
  );
};

export default CategoryCRUD;
