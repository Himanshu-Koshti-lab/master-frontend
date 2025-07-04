import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react'; // ✅ Lucide icon here!
import API from '../api/axios';
import './LandingPage.css'; // Import your CSS styles

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const handleLoginOpen = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/auth/login?username=${username}&password=${password}`);
      const { token, role, id } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      localStorage.setItem('id', id);

      navigate('/dashboard');
      setShowLogin(false);
    } catch (err) {
      console.error('❌ Login failed:', err);
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo">🛒 Master E-Commerce</div>
        <button className="login-button" onClick={handleLoginOpen}>Login</button>
      </header>

      <main className="landing-content">
        
        {products.length === 0 ? (
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
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="note">
          🔒 JWT Auth • Role-Based Security: admin / vendor / customer • Spring Boot 3 + React + Vite
        </p>
      </main>

      {showLogin && (
        <div className="modal-overlay" onClick={handleLoginClose}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleLoginClose}>✖</button>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="submit-login">Login</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
