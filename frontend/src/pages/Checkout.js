import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalDiscount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.email || !formData.address) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (cartItems.length === 0) {
      alert('ตะกร้าของคุณว่างเปล่า');
      return;
    }

    try {
      setLoading(true);

      const totalPrice = getTotalPrice();
      const totalDiscount = getTotalDiscount();
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          discountedPrice: item.promotion?.discountedPrice || 0,
          total: (item.promotion?.discountedPrice || item.price) * item.quantity
        })),
        subtotal,
        totalDiscount,
        total: totalPrice
      };

      const response = await apiClient.createOrder(orderData);

      setOrderMessage(response.data.messagePreview);
      setSuccess(true);
      clearCart();

      // Prepare LINE message
      const lineMessage = encodeURIComponent(response.data.messagePreview);
      const lineUrl = `https://line.me/R/msg/text/${lineMessage}`;

      setTimeout(() => {
        window.open(lineUrl, '_blank');
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <p>ตะกร้าของคุณว่างเปล่า</p>
          <button onClick={() => navigate('/shop')}>ไปที่หน้าช็อป</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="success-container">
          <div className="success-icon"><FiCheck /></div>
          <h1>สั่งซื้อสำเร็จ!</h1>
          <p>ขอบคุณสำหรับการสั่งซื้อ</p>
          <p>ข้อมูลการสั่งซื้อจะถูกส่งไปยัง LINE ของคุณ</p>
          <div className="order-preview">
            <h3>รายการสั่งซื้อ</h3>
            <pre>{orderMessage}</pre>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const totalDiscount = getTotalDiscount();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="checkout-page">
      <h1>ชำระเงิน</h1>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>ข้อมูลการติดต่อ</h2>

            <div className="form-group">
              <label htmlFor="customerName">ชื่อ-นามสกุล *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">เบอร์โทรศัพท์ *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0xxxxxxxxx"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">อีเมล *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">ที่อยู่ *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            <FiSend /> {loading ? 'กำลังดำเนินการ...' : 'ส่งคำสั่งซื้อไปยัง LINE'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>สรุปสินค้า</h2>

          <div className="order-items">
            {cartItems.map(item => (
              <div key={item._id} className="order-item">
                <div>
                  <h4>{item.name}</h4>
                  <small>จำนวน: {item.quantity} ชิ้น</small>
                </div>
                <span className="price">
                  ฿{((item.promotion?.discountedPrice || item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-line">
            <span>รวมค่าสินค้า:</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="summary-line discount">
              <span>ส่วนลด:</span>
              <span>-฿{totalDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-line total">
            <span>ยอดรวมสุทธิ:</span>
            <span>฿{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
