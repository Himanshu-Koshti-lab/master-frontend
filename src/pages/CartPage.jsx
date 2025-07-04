import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify'; // ✅ Import toast
import './CartPage.css';

export default function CartPage({ onCheckoutSuccess, onItemRemoved }) {
  const [cart, setCart] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        API.get('/cart'),
        API.get('/products'),
      ]);

      const map = {};
      productsRes.data.forEach((prod) => {
        map[prod.id] = prod;
      });

      setProductsMap(map);
      setCart(cartRes.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Failed to load cart or products:', err);
      toast.error('Failed to load cart.');
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await API.post(`/cart/remove`, { itemId });
      toast.success('Item removed from cart!');
      if (onItemRemoved) {
        onItemRemoved();
      }
      fetchCartAndProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove item.');
    }
  };

  const handleCheckout = async () => {
    try {
      await API.post('/cart/checkout');
      toast.success('✅ Order placed! Your cart is now empty.');
      if (onCheckoutSuccess) {
        onCheckoutSuccess();
      }
      fetchCartAndProducts();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to checkout.');
    }
  };

  if (loading) return <p>Loading your cart...</p>;

  const calculateGrandTotal = () => {
    return cart.items.reduce((sum, item) => {
      const product = productsMap[item.productId];
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {!cart || cart.items.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Add some products!</p>
      ) : (
        <div className="cart-content">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => {
                const product = productsMap[item.productId];
                const price = product ? product.price : 0;
                const subtotal = price * item.quantity;

                const handleUpdateQuantity = async (newQuantity) => {
                  if (newQuantity < 1) {
                    handleRemoveItem(item.id);
                    return;
                  }
                  try {
                    const customerId = localStorage.getItem('username');
                    if (!customerId) {
                      toast.error('Please log in to update your cart.');
                      return;
                    }
                    const existingItem = cart.items.find(i => i.id === item.id);
                    if (existingItem && existingItem.quantity === newQuantity) {
                      return; // no change
                    }
                    await API.post(`/cart/update?customerId=${customerId}&itemId=${item.id}&quantity=${newQuantity}`);
                    toast.success('Quantity updated!');
                    fetchCartAndProducts();
                  } catch (err) {
                    console.error(err);
                    toast.error('❌ Failed to update quantity.');
                  }
                };

                return (
                  <tr key={item.id}>
                    <td>{product ? product.name : `ID ${item.productId}`}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleUpdateQuantity(item.quantity - 1)}>➖</button>
                      <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.quantity + 1)}>➕</button>
                    </td>
                    <td>${subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="cart-summary">
            <p className="summary-line">
              <strong>Total Items:</strong> {cart.items.length}
            </p>
            <p className="summary-line">
              <strong>Grand Total:</strong> ${calculateGrandTotal().toFixed(2)}
            </p>
            <button className="btn-checkout" onClick={handleCheckout}>
              ✅ Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
