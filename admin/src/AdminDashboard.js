import React, { useState, useEffect } from 'react';
import { FiLogOut, FiHome, FiBox, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import Login from './pages/Login';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token || !email) {
      navigate('/login');
    } else {
      setAdmin({ email });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setAdmin(null);
    navigate('/login');
  };

  if (!admin) {
    return <Login onLogin={setAdmin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <Dashboard admin={admin} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin</h2>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <FiHome /> {sidebarOpen && 'แdashboard'}
          </button>
          <button
            className={`nav-item ${currentPage === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentPage('products')}
          >
            <FiBox /> {sidebarOpen && 'จัดการสินค้า'}
          </button>
          <button
            className={`nav-item ${currentPage === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentPage('orders')}
          >
            <FiShoppingCart /> {sidebarOpen && 'จัดการคำสั่งซื้อ'}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info" style={{ display: sidebarOpen ? 'block' : 'none' }}>
            <p className="user-email">{admin.email}</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut /> {sidebarOpen && 'ออกจากระบบ'}
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <button 
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1>Admin Panel</h1>
        </header>

        <div className="content-area">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

const Dashboard = ({ admin }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  return (
    <div className="dashboard">
      <div className="welcome">
        <h1>ยินดีต้อนรับ, {admin.email}</h1>
        <p>ระบบจัดการสินค้าและคำสั่งซื้อ</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">📦</div>
          <div className="stat-info">
            <h3>สินค้า</h3>
            <p className="stat-value">กำลังโหลด...</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">🛒</div>
          <div className="stat-info">
            <h3>คำสั่งซื้อ</h3>
            <p className="stat-value">กำลังโหลด...</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>รายได้</h3>
            <p className="stat-value">กำลังโหลด...</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>การกระทำด่วน</h2>
        <div className="actions-grid">
          <button className="action-button">
            <span className="icon">➕</span>
            <span>เพิ่มสินค้าใหม่</span>
          </button>
          <button className="action-button">
            <span className="icon">📋</span>
            <span>ดูคำสั่งซื้อ</span>
          </button>
          <button className="action-button">
            <span className="icon">📊</span>
            <span>สถิติการขาย</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
