import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiDownload, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { apiClient } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [productRes, recommendedRes] = await Promise.all([
        apiClient.getProductById(id),
        apiClient.getRecommendedProducts(id)
      ]);
      setProduct(productRes.data);
      setRecommended(recommendedRes.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลด...</div>;
  }

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบสินค้า</div>;
  }

  const displayPrice = product.promotion?.discountedPrice || product.price;
  const hasPromotion = product.promotion?.isActive && product.promotion?.discountedPrice > 0;

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>หน้าแรก</span>
        <FiChevronRight />
        <span>{product.name}</span>
      </div>

      <div className="detail-container">
        <div className="detail-images">
          <div className="main-image">
            <img src={getImageUrl(product.images?.[selectedImage])} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images?.slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
                alt={`${product.name} ${idx + 1}`}
                className={selectedImage === idx ? 'active' : ''}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>

          <div className="meta-info">
            <span className="category">
              {product.category === 'solar' && '🔆 โซล่าเซลล์'}
              {product.category === 'software' && '💻 ซอฟต์แวร์'}
              {product.category === 'network' && '🌐 เน็ตเวิร์ค'}
            </span>
            <span className="color">
              {product.color === 'white' && '⚪ ขาว'}
              {product.color === 'black' && '⚫ ดำ'}
            </span>
          </div>

          <div className="pricing">
            {hasPromotion ? (
              <>
                <span className="original">฿{product.price.toLocaleString()}</span>
                <span className="sale">฿{displayPrice.toLocaleString()}</span>
                <span className="discount-badge">ลด {product.promotion.discountPercent}%</span>
              </>
            ) : (
              <span className="price">฿{displayPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">✓ มีสต๊อก ({product.stock} ชิ้น)</span>
            ) : (
              <span className="out-of-stock">✗ สินค้าหมด</span>
            )}
          </div>

          <div className="description">
            <h3>รายละเอียด</h3>
            <p>{product.description}</p>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>จำนวน</label>
              <div className="quantity-input">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button
              className="btn-add-cart"
              onClick={() => {
                addToCart(product, quantity);
                alert('เพิ่มลงตะกร้าแล้ว');
              }}
              disabled={product.stock === 0}
            >
              <FiShoppingCart /> เพิ่มลงตะกร้า
            </button>
          </div>

          {product.datasheet && (
            <a
              href={getImageUrl(product.datasheet)}
              target="_blank"
              rel="noopener noreferrer"
              className="datasheet-link"
            >
              <FiDownload /> ดาวน์โหลด Datasheet
            </a>
          )}
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="recommended-section">
          <h2>สินค้าแนะนำในหมวดเดียวกัน</h2>
          <div className="recommended-grid">
            {recommended.map(item => (
              <div
                key={item._id}
                className="recommended-card"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <img src={getImageUrl(item.images?.[0])} alt={item.name} />
                <h4>{item.name}</h4>
                <p className="price">฿{(item.promotion?.discountedPrice || item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
