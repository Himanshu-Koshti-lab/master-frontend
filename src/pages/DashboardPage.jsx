import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersPage from './OrdersPage';
import ProductsPage from './ProductsPage';
import API from '../api/axios';
import './DashboardPage.css' // ✅ add this line

export default function DashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [employee, setEmployee] = useState(null);

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const employeeId = localStorage.getItem('id');

  // ✅ Auth check: redirect to login if no username or role
  useEffect(() => {
    if (!username || !role) {
      console.warn('User not logged in, redirecting to login...');
      navigate('/login');
    }
  }, [username, role, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!employeeId) {
          console.warn('No employee ID found in localStorage');
          return;
        }

        const res = await API.get(`/employees/${employeeId}`);
        console.log('✅ Employee API response:', res.data);
        setEmployee(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch employee:', err);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return (
    <div className="dashboard-container">
  <header className="dashboard-header">
    <h2>E-Commerce Dashboard</h2>
    <div className="user-info">
      <span className="username">
        👤 {username || 'Guest'}
        <span className="tooltip">ID: {employeeId || 'N/A'}</span>
      </span>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  </header>

  <div className="dashboard-main">
    <nav className="sidebar">
      <button
        className={`sidebar-button ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        📦 Orders
      </button>
      <button
        className={`sidebar-button ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => setActiveTab('products')}
      >
        🛍️ Products
      </button>
    </nav>

    <main className="dashboard-content">
      {activeTab === 'orders' && <OrdersPage />}
      {activeTab === 'products' && <ProductsPage />}
    </main>
  </div>
</div>

  );
}
