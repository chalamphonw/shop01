import React from 'react';
import { FiShoppingCart, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  
  const displayPrice = product.promotion?.discountedPrice || product.price;
  const hasPromotion = product.promotion?.isActive && product.promotion?.discountedPrice > 0;
  const discountPercent = product.promotion?.discountPercent || 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={getImageUrl(product.images?.[0])} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-badges">
          {hasPromotion && (
            <span className="badge promotion">
              <FiTag /> {discountPercent}% OFF
            </span>
          )}
          {product.isBestSale && (
            <span className="badge best-sale">⭐ ขายดี</span>
          )}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-category">
          {product.category === 'solar' && 'โซล่าเซลล์'}
          {product.category === 'software' && 'ซอฟต์แวร์'}
          {product.category === 'network' && 'เน็ตเวิร์ค'}
        </div>

        <div className="product-colors">
          {product.color === 'white' && <span className="color-badge white">⚪ ขาว</span>}
          {product.color === 'black' && <span className="color-badge black">⚫ ดำ</span>}
        </div>

        <div className="product-price">
          {hasPromotion ? (
            <>
              <span className="original-price">฿{product.price.toLocaleString()}</span>
              <span className="sale-price">฿{displayPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="price">฿{displayPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">มีสต๊อก ({product.stock})</span>
          ) : (
            <span className="out-of-stock">สินค้าหมด</span>
          )}
        </div>

        <div className="product-actions">
          <button 
            className="btn-details"
            onClick={() => onViewDetails(product._id)}
          >
            ดูรายละเอียด
          </button>
          <button 
            className="btn-cart"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <FiShoppingCart /> เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
