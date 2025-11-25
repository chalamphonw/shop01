import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalDiscount, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <FiShoppingBag />
        <h2>ตะกร้าของคุณยังว่างเปล่า</h2>
        <p>เริ่มช็อปปิ้งเพื่อเพิ่มสินค้า</p>
        <button onClick={() => navigate('/shop')}>ไปที่หน้าช็อป</button>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const totalDiscount = getTotalDiscount();
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <h1>ตะกร้าสินค้า</h1>

      <div className="cart-container">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>สินค้า</th>
                <th>ราคา</th>
                <th>จำนวน</th>
                <th>รวม</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => {
                const itemPrice = item.promotion?.discountedPrice || item.price;
                const itemTotal = itemPrice * item.quantity;
                return (
                  <tr key={item._id}>
                    <td className="product-name">
                      <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <small>{item.category === 'solar' && '🔆'} {item.category === 'software' && '💻'} {item.category === 'network' && '🌐'}</small>
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        {item.promotion?.discountedPrice ? (
                          <>
                            <span className="original">฿{item.price.toLocaleString()}</span>
                            <span className="sale">฿{item.promotion.discountedPrice.toLocaleString()}</span>
                          </>
                        ) : (
                          <span>฿{item.price.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="total-cell">
                      ฿{itemTotal.toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item._id)}
                        title="ลบสินค้า"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h2>สรุปการชำระเงิน</h2>
          
          <div className="summary-row">
            <span>ยอดรวม:</span>
            <span>฿{subtotal.toLocaleString()}</span>
          </div>

          {totalDiscount > 0 && (
            <div className="summary-row discount">
              <span>ส่วนลด:</span>
              <span>-฿{totalDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>ยอดรวมสุทธิ:</span>
            <span>฿{totalPrice.toLocaleString()}</span>
          </div>

          <button 
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            ไปที่การชำระเงิน
          </button>

          <button 
            className="btn-continue-shopping"
            onClick={() => navigate('/shop')}
          >
            ช็อปปิ้งต่อ
          </button>

          <button
            className="btn-clear-cart"
            onClick={() => {
              if (window.confirm('ยืนยันการลบสินค้าทั้งหมด?')) {
                clearCart();
              }
            }}
          >
            ลบทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
