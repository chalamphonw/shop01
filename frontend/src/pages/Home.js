import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart, FiTruck, FiShield, FiCreditCard, FiZap } from 'react-icons/fi';
import { apiClient } from '../services/api';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);
  const [bestSaleProducts, setBestSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getProducts();
      const allProducts = response.data;

      setProducts(allProducts);
      setPromotionProducts(allProducts.filter(p => p.promotion?.isActive).slice(0, 8));
      setBestSaleProducts(allProducts.filter(p => p.isBestSale).slice(0, 8));
      
      // Extract unique categories
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getCategoryName = (category) => {
    const names = {
      'solar': 'โซล่าเซลล์',
      'network': 'เครือข่าย',
      'electric': 'ไฟฟ้า',
      'software': 'ซอฟต์แวร์'
    };
    return names[category] || category;
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>ยินดีต้อนรับสู่ร้านค้าออนไลน์</h1>
            <p>สินค้าคุณภาพดี ราคาถูก จัดส่งฟรีทั่วประเทศ</p>
          </div>
        </div>
      </section>

      {/* Solar Products Section */}
      <section className="section promotion-section">
        <div className="section-header">
          <h2><span className="section-emoji">☀️</span> โซล่าเซลล์</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shop?category=solar'); }} className="view-all">
            ดูทั้งหมด <FiArrowRight />
          </a>
        </div>
        
        <div className="products-grid">
          {products.filter(p => p.category === 'solar').length > 0 ? (
            products.filter(p => p.category === 'solar').slice(0, 8).map(product => (
              <div
                key={product._id}
                className="product-card-home"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="product-image">
                  <img src={getImageUrl(product.images?.[0])} alt={product.name} />
                  <div className="product-badges">
                    {product.promotion?.isActive && (
                      <span className="badge promotion-badge">
                        -{product.promotion?.discountPercent}%
                      </span>
                    )}
                    {product.isBestSale && (
                      <span className="badge bestsale-badge">
                        ⭐ ขายดี
                      </span>
                    )}
                  </div>
                  <button 
                    className="quick-add-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <FiShoppingCart /> เพิ่มลงตะกร้า
                  </button>
                </div>
                <div className="product-details">
                  <p className="product-category">โซล่าเซลล์</p>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐ <span>(4.5)</span>
                  </div>
                  <div className="price">
                    {product.promotion?.isActive ? (
                      <>
                        <span className="original-price">฿{product.price.toLocaleString()}</span>
                        <span className="sale-price">฿{product.promotion?.discountedPrice?.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="current-price">฿{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </section>

      {/* Software Products Section */}
      <section className="section best-sale-section">
        <div className="section-header">
          <h2><span className="section-emoji">💻</span> ซอฟต์แวร์</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shop?category=software'); }} className="view-all">
            ดูทั้งหมด <FiArrowRight />
          </a>
        </div>

        <div className="products-grid">
          {products.filter(p => p.category === 'software').length > 0 ? (
            products.filter(p => p.category === 'software').slice(0, 8).map(product => (
              <div
                key={product._id}
                className="product-card-home"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="product-image">
                  <img src={getImageUrl(product.images?.[0])} alt={product.name} />
                  <div className="product-badges">
                    {product.promotion?.isActive && (
                      <span className="badge promotion-badge">
                        -{product.promotion?.discountPercent}%
                      </span>
                    )}
                    {product.isBestSale && (
                      <span className="badge bestsale-badge">
                        ⭐ ขายดี
                      </span>
                    )}
                  </div>
                  <button 
                    className="quick-add-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <FiShoppingCart /> เพิ่มลงตะกร้า
                  </button>
                </div>
                <div className="product-details">
                  <p className="product-category">ซอฟต์แวร์</p>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐ <span>(5.0)</span>
                  </div>
                  <div className="price">
                    {product.promotion?.isActive ? (
                      <>
                        <span className="original-price">฿{product.price.toLocaleString()}</span>
                        <span className="sale-price">฿{product.promotion?.discountedPrice?.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="current-price">฿{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </section>

      {/* Network Products Section */}
      <section className="section promotion-section">
        <div className="section-header">
          <h2><span className="section-emoji">🌐</span> เน็ตเวิร์ค</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shop?category=network'); }} className="view-all">
            ดูทั้งหมด <FiArrowRight />
          </a>
        </div>

        <div className="products-grid">
          {products.filter(p => p.category === 'network').length > 0 ? (
            products.filter(p => p.category === 'network').slice(0, 8).map(product => (
              <div
                key={product._id}
                className="product-card-home"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <div className="product-image">
                  <img src={getImageUrl(product.images?.[0])} alt={product.name} />
                  <div className="product-badges">
                    {product.promotion?.isActive && (
                      <span className="badge promotion-badge">
                        -{product.promotion?.discountPercent}%
                      </span>
                    )}
                    {product.isBestSale && (
                      <span className="badge bestsale-badge">
                        ⭐ ขายดี
                      </span>
                    )}
                  </div>
                  <button 
                    className="quick-add-btn"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <FiShoppingCart /> เพิ่มลงตะกร้า
                  </button>
                </div>
                <div className="product-details">
                  <p className="product-category">เน็ตเวิร์ค</p>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐ <span>(4.8)</span>
                  </div>
                  <div className="price">
                    {product.promotion?.isActive ? (
                      <>
                        <span className="original-price">฿{product.price.toLocaleString()}</span>
                        <span className="sale-price">฿{product.promotion?.discountedPrice?.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="current-price">฿{product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>ไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
