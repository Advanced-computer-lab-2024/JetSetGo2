import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCapabilities = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Admin Capabilities</h1>

      <button
        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        onClick={() => navigate('/category')}
      >
        Manage Categories
      </button>

      <br />

      <button
        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        onClick={() => navigate('/TagsManagement')}
      >
        Manage Tags
      </button>

      <br />

      <button
        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        onClick={() => navigate('/product')}
      >
        Manage Products
      </button>

      <br />

      <button
        style={{ margin: '10px', padding: '10px', fontSize: '16px' }}
        onClick={() => navigate('/productList')}
      >
        View Product List
      </button>
    </div>
  );
};

export default AdminCapabilities;
