import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchOrders();
  }, [username]);

  const fetchOrders = async () => {
    try {
      // Always use secure endpoint
      const endpoint = '/orders/my';
      console.log(`Fetching orders for user: ${username}`);
      const res = await API.get(endpoint);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await API.delete(`/orders/${orderId}`);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete order');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <h3>My Orders</h3>

      {error && <p className="error-message">{error}</p>}

      {orders.length === 0 ? (
        <p className="no-data">No orders found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product IDs</th>
                <th>Total</th>
                <th>Customer ID</th>
                {/* Optionally keep delete only if your backend allows user self-delete */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.productIds?.join(', ')}</td>
                  <td>${order.total}</td>
                  <td>{order.customerId}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
