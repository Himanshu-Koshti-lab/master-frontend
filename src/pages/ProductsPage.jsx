import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Save } from 'lucide-react'; // Lucide icons!
import API from '../api/axios';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setCount] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', count: '' });

  const role = localStorage.getItem('role')?.toLowerCase();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !count) {
      setError('Please fill all fields');
      return;
    }
    try {
      const newProduct = { name, price: parseFloat(price), count: parseInt(count) };
      const res = await API.post('/products', newProduct);
      setProducts(prev => [...prev, res.data]);
      setName('');
      setPrice('');
      setCount('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await API.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      count: product.count,
    });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (productId) => {
    try {
      const updatedProduct = {
        ...editData,
        price: parseFloat(editData.price),
        count: parseInt(editData.count),
      };
      const res = await API.put(`/products/${productId}`, updatedProduct);
      setProducts(prev => prev.map(p => (p.id === productId ? res.data : p)));
      setEditId(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update product');
    }
  };

  return (
    <div className="container">
      <h3>Products List</h3>

      {error && <p className="error-message">{error}</p>}

      {role === 'admin' || role === 'vendor' ? (
        <form className="add-product-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          <button type="submit" className="btn btn-add">Add Product</button>
        </form>
      ) : null}

      {products.length === 0 ? (
        <p className="no-data">No products found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Count</th>
                {(role === 'admin' || role === 'vendor') && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>

                  <td>
                    {editId === product.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                      />
                    ) : (
                      product.name
                    )}
                  </td>

                  <td>
                    {editId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editData.price}
                        onChange={(e) => handleEditChange('price', e.target.value)}
                      />
                    ) : (
                      `$${product.price}`
                    )}
                  </td>

                  <td>
                    {editId === product.id ? (
                      <input
                        type="number"
                        value={editData.count}
                        onChange={(e) => handleEditChange('count', e.target.value)}
                      />
                    ) : (
                      product.count
                    )}
                  </td>

                  {(role === 'admin' || role === 'vendor') && (
                    <td>
                      {editId === product.id ? (
                        <button className="icon-btn" onClick={() => handleSave(product.id)}>
                          <Save size={18} />
                        </button>
                      ) : (
                        <>
                          <button className="icon-btn" onClick={() => startEdit(product)}>
                            <Edit size={18} />
                          </button>
                          {role === 'admin' && (
                            <button className="icon-btn" onClick={() => handleDelete(product.id)}>
                              <Trash2 size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
