import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { apiClient } from '../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);
  const [bestSaleProducts, setBestSaleProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts();
      const allProducts = response.data;

      setProducts(allProducts);
      setPromotionProducts(allProducts.filter(p => p.promotion?.isActive).slice(0, 6));
      setBestSaleProducts(allProducts.filter(p => p.isBestSale).slice(0, 6));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>โซลูชันพลังงานอัจฉริยะ</h1>
          <p>พบกับสินค้าและบริการยอดนิยมของเรา</p>
          <button onClick={() => navigate('/shop')} className="btn-explore">
            <FiArrowRight /> ดูทั้งหมด
          </button>
        </div>
      </section>

      {/* Promotion Section */}
      <section className="section promotion-section">
        <div className="section-header">
          <h2>🎉 โปรโมชั่นพิเศษ</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="view-all">
            ดูทั้งหมด <FiArrowRight />
          </a>
        </div>
        
        <div className="products-grid">
          {promotionProducts.map(product => (
            <div
              key={product._id}
              className="product-item"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image">
                <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                <span className="badge promotion-badge">
                  {product.promotion?.discountPercent}% OFF
                </span>
              </div>
              <h3>{product.name}</h3>
              <div className="price">
                <span className="original">฿{product.price.toLocaleString()}</span>
                <span className="sale">฿{product.promotion?.discountedPrice?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sale Section */}
      <section className="section best-sale-section">
        <div className="section-header">
          <h2>⭐ ขายดี</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shop'); }} className="view-all">
            ดูทั้งหมด <FiArrowRight />
          </a>
        </div>

        <div className="products-grid">
          {bestSaleProducts.map(product => (
            <div
              key={product._id}
              className="product-item"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image">
                <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                <span className="badge best-sale-badge">⭐ ขายดี</span>
              </div>
              <h3>{product.name}</h3>
              <div className="price">
                <span className="current">฿{(product.promotion?.discountedPrice || product.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <h2>หมวดหมู่สินค้า</h2>
        <div className="categories-grid">
          <div 
            className="category-card"
            onClick={() => navigate('/shop')}
            style={{
              backgroundImage: 'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23e3f2fd" width="200" height="200"/%3E%3Ctext x="100" y="100" font-size="60" text-anchor="middle" dominant-baseline="middle"%3E🔆%3C/text%3E%3C/svg%3E)'
            }}
          >
            <h3>โซล่าเซลล์</h3>
            <p>แผงเซลล์แสงอาทิตย์ คุณภาพสูง</p>
          </div>

          <div 
            className="category-card"
            onClick={() => navigate('/shop')}
            style={{
              backgroundImage: 'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f3e5f5" width="200" height="200"/%3E%3Ctext x="100" y="100" font-size="60" text-anchor="middle" dominant-baseline="middle"%3E💻%3C/text%3E%3C/svg%3E)'
            }}
          >
            <h3>ซอฟต์แวร์</h3>
            <p>ระบบจัดการสมัยใหม่</p>
          </div>

          <div 
            className="category-card"
            onClick={() => navigate('/shop')}
            style={{
              backgroundImage: 'url(data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f0f7ff" width="200" height="200"/%3E%3Ctext x="100" y="100" font-size="60" text-anchor="middle" dominant-baseline="middle"%3E🌐%3C/text%3E%3C/svg%3E)'
            }}
          >
            <h3>เน็ตเวิร์ค</h3>
            <p>โซลูชันเชื่อมต่อระดับวิชาชีพ</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>พร้อมที่จะเริ่มต้นหรือยัง?</h2>
        <p>สำรวจแคตตาล็อกผลิตภัณฑ์ของเราที่สมบูรณ์</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/shop')} className="btn-primary">
            เลือกซื้อเลย
          </button>
          <button onClick={() => navigate('/contact')} className="btn-secondary">
            ติดต่อเรา
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
