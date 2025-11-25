import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import { adminApi } from '../services/api';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('ไม่สามารถโหลดคำสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>จัดการคำสั่งซื้อ</h1>
        <span className="order-count">รวม {orders.length} คำสั่งซื้อ</span>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-detail" onClick={e => e.stopPropagation()}>
            <h2>รายละเอียดคำสั่งซื้อ</h2>
            <div className="order-detail-content">
              <div className="detail-section">
                <h3>ข้อมูลลูกค้า</h3>
                <p><strong>ชื่อ:</strong> {selectedOrder.customerName}</p>
                <p><strong>เบอร์โทร:</strong> {selectedOrder.phone}</p>
                <p><strong>อีเมล:</strong> {selectedOrder.email}</p>
                <p><strong>ที่อยู่:</strong> {selectedOrder.address}</p>
              </div>

              <div className="detail-section">
                <h3>รายการสินค้า</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>สินค้า</th>
                      <th>จำนวน</th>
                      <th>ราคา</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>฿{item.price.toLocaleString()}</td>
                        <td>฿{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="detail-section summary">
                <div className="summary-row">
                  <span>รวมค่าสินค้า:</span>
                  <span>฿{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.totalDiscount > 0 && (
                  <div className="summary-row discount">
                    <span>ส่วนลด:</span>
                    <span>-฿{selectedOrder.totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>ยอดรวมสุทธิ:</span>
                  <span>฿{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>ข้อความที่ส่ง</h3>
                <pre className="message-preview">{selectedOrder.messageText}</pre>
              </div>

              <div className="detail-actions">
                <button 
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>ชื่อลูกค้า</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
              <th>จำนวนสินค้า</th>
              <th>ยอดรวม</th>
              <th>วันที่</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <tr key={order._id}>
                  <td>#{idx + 1}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.email}</td>
                  <td>{order.items.length}</td>
                  <td className="amount">฿{order.total.toLocaleString()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye /> ดู
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  ไม่มีคำสั่งซื้อ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
