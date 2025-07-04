import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersPage from './OrdersPage';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import API from '../api/axios';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [employee, setEmployee] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role')?.toLowerCase();
  const employeeId = localStorage.getItem('id');

  // ✅ Auth check
  useEffect(() => {
    if (!username || !role) {
      console.warn('User not logged in, redirecting to login...');
      navigate('/login');
    }
  }, [username, role, navigate]);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employeeId) return;
      try {
        const res = await API.get(`/employees/${employeeId}`);
        setEmployee(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch employee:', err);
      }
    };
    fetchEmployee();
  }, [employeeId]);

  // ✅ Fetch products if viewing products tab
  useEffect(() => {
    if (activeTab === 'products' && role === 'customer') {
      fetchProducts();
    }
  }, [activeTab, role]);

  // ✅ Fetch cart count for customer
  useEffect(() => {
    if (role === 'customer') {
      fetchCartCount();
    }
  }, [role]);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await API.get('/cart');
      setCartCount(res.data.items?.length || 0);
    } catch (err) {
      console.error('❌ Failed to fetch cart:', err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      alert('✅ Product added to cart!');
      setCartCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add to cart.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>E-Commerce Dashboard</h2>

        <div className="header-actions">
          {role === 'customer' && (
            <div
              className="cart-icon"
              onClick={() => setActiveTab('cart')}
              style={{ cursor: 'pointer' }}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          )}

          <div className="user-info">
            <span className="username">
              👤 {username || 'Guest'}
              <span className="tooltip">ID: {employeeId || 'N/A'}</span>
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
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

          {activeTab === 'products' &&
            (role === 'customer' ? (
              products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <div className="product-card" key={product.id}>
                      <div className="product-icon">
                        <ShoppingBag size={48} color="#2874f0" />
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <button
                          className="btn-add"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <ProductsPage />
            ))}

          {activeTab === 'cart' && role === 'customer' && (
            <CartPage
              onCheckoutSuccess={() => setCartCount(0)}
              onItemRemoved={() => setCartCount(prev => Math.max(prev - 1, 0))}
            />
          )}
        </main>
      </div>
    </div>
  );
}
