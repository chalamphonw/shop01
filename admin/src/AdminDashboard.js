import React, { useState, useEffect } from 'react';
import { FiLogOut, FiBox, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import Login from './pages/Login';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('products');
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      setAdmin({ email });
    }
  }, []);

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
      case 'orders':
        return <OrderManagement />;
      default:
        return <ProductManagement />;
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

export default AdminDashboard;
