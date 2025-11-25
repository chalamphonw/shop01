import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ShopFilter from '../components/ShopFilter';
import { apiClient } from '../services/api';
import './Shop.css';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    promotion: false,
    bestSale: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    
    let filtered = products;

    // Search
    if (newFilters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(newFilters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(newFilters.search.toLowerCase())
      );
    }

    // Category
    if (newFilters.category) {
      filtered = filtered.filter(p => p.category === newFilters.category);
    }

    // Price range
    if (newFilters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(newFilters.minPrice));
    }
    if (newFilters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(newFilters.maxPrice));
    }

    // Color
    if (newFilters.color) {
      filtered = filtered.filter(p => p.color === newFilters.color);
    }

    // Promotion
    if (newFilters.promotion) {
      filtered = filtered.filter(p => p.promotion?.isActive);
    }

    // Best Sale
    if (newFilters.bestSale) {
      filtered = filtered.filter(p => p.isBestSale);
    }

    setFilteredProducts(filtered);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="shop-container">
      <ShopFilter onFilter={handleFilter} categories={['solar', 'software', 'network']} />
      
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>กำลังโหลดสินค้า...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="shop-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="shop-grid empty">
            <h3>ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
            <p>ลองปรับปรุงเงื่อนไขการค้นหาของคุณ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
