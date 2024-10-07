import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../services/CategoryService';

const CategoryCRUD = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({ name: '' });
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

    // Button styles for admin navigation
    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#2d3e50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s',
        width: '180px',
        textAlign: 'center',
    };

    const handleHover = (e) => {
        e.target.style.backgroundColor = '#0056b3';
        e.target.style.transform = 'scale(1.05)';
    };

    const handleLeave = (e) => {
        e.target.style.backgroundColor = '#2d3e50';
        e.target.style.transform = 'scale(1)';
    };

    return (
        <div style={styles.container}>
            {/* Sidebar with Profile and Admin Buttons */}
            <div style={styles.sidebar}>
                <div style={styles.profileContainer}>
                    <img
                        src="https://i.pngimg.me/thumb/f/720/c3f2c592f9.jpg"
                        alt="Profile"
                        style={styles.profileImage}
                    />
                    <h2 style={styles.profileName}>Admin</h2>
                    <p>Admin</p>
                    <button onClick={() => navigate('/adminCapabilities')} style={styles.button}>
                        Admin Home
                    </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    {[  
                        { label: 'Manage Categories', path: '/category' },
                        { label: 'Manage Tags', path: '/TagsManagement' },
                        { label: 'Manage Products', path: '/product' },
                        { label: 'View Product List', path: '/productList' },
                        { label: 'Delete Users', path: '/DeleteUsers' },
                        { label: 'Add a Tourism Governor', path: '/AddTourismGovernor' },
                        { label: 'Add an Admin', path: '/AddAdmin' },
                    ].map((button) => (
                        <button
                            key={button.path}
                            style={buttonStyle}
                            onClick={() => navigate(button.path)}
                            onMouseEnter={handleHover}
                            onMouseLeave={handleLeave}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <h1>Category Management</h1>

                {/* Display success/error message */}
                {message && <p style={styles.message}>{message}</p>}

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
                        <div style={styles.categoryContainer}>
                            {categories.map((category) => (
                                <div key={category._id} style={styles.categoryCard}>
                                    <h3 style={styles.categoryName}>{category.name}</h3>
                                    <div style={styles.categoryActions}>
                                        <button style={styles.actionButton} onClick={() => handleEdit(category)}>Edit</button>
                                        <button style={styles.actionButton} onClick={() => handleDelete(category._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No categories found.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: 'flex',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#2d3e50',
        padding: '20px',
        borderRadius: '10px',
        color: '#fff',
    },
    profileContainer: {
        textAlign: 'center',
    },
    profileImage: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
    },
    profileName: {
        margin: '10px 0',
        fontSize: '18px',
    },
    mainContent: {
        flexGrow: 1,
        padding: '20px',
        marginLeft: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    message: {
        color: 'red',
    },
    categoryContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '20px',
    },
    categoryCard: {
        flex: '1 1 calc(30% - 20px)', // Adjust the width as needed
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
    },
    categoryName: {
        margin: '0',
        fontSize: '20px',
        color: '#333',
    },
    categoryActions: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 15px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default CategoryCRUD;
