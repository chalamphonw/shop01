import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiHome, FiPhone } from 'react-icons/fi';
import { CartProvider, useCart } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import './App.css';

const Layout = ({ children }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">E-Commerce</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>หน้าแรก</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>ช็อป</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>ติดต่อเรา</Link>
          </nav>

          <div className="header-actions">
            <button 
              className="cart-button"
              onClick={() => navigate('/cart')}
            >
              <FiShoppingCart />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </button>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>เกี่ยวกับเรา</h3>
            <p>บริษัทที่ให้บริการด้านพลังงานแบบครบวงจร</p>
          </div>

          <div className="footer-section">
            <h3>ลิงก์ด่วน</h3>
            <ul>
              <li><Link to="/">หน้าแรก</Link></li>
              <li><Link to="/shop">ช็อป</Link></li>
              <li><Link to="/contact">ติดต่อเรา</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>ติดต่อ</h3>
            <p>📧 info@example.com</p>
            <p>📞 +66 (0) 2-xxx-xxxx</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 E-Commerce. สงวนลิขสิทธิ์ทั้งหมด</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout>
                <Home />
              </Layout>
            } 
          />
          <Route 
            path="/shop" 
            element={
              <Layout>
                <Shop />
              </Layout>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <Layout>
                <Cart />
              </Layout>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <Layout>
                <Checkout />
              </Layout>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Layout>
                <Contact />
              </Layout>
            } 
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
