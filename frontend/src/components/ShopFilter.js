import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './Shop.css';

const ShopFilter = ({ onFilter, categories }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    promotion: false,
    bestSale: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="shop-filter">
      <div className="filter-section">
        <h3><FiFilter /> ค้นหาและกรอง</h3>
        
        <div className="filter-group">
          <label>ค้นหาสินค้า</label>
          <div className="search-input">
            <FiSearch />
            <input
              type="text"
              name="search"
              placeholder="ค้นหาชื่อสินค้า..."
              value={filters.search}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>หมวดหมู่</label>
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">ทั้งหมด</option>
            <option value="solar">โซล่าเซลล์</option>
            <option value="software">ซอฟต์แวร์</option>
            <option value="network">เน็ตเวิร์ค</option>
          </select>
        </div>

        <div className="filter-group">
          <label>ราคา (บาท)</label>
          <div className="price-range">
            <input
              type="number"
              name="minPrice"
              placeholder="ต่ำสุด"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="สูงสุด"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>สี</label>
          <select name="color" value={filters.color} onChange={handleChange}>
            <option value="">ทั้งหมด</option>
            <option value="white">ขาว</option>
            <option value="black">ดำ</option>
          </select>
        </div>

        <div className="filter-group checkbox">
          <label>
            <input
              type="checkbox"
              name="promotion"
              checked={filters.promotion}
              onChange={handleChange}
            />
            โปรโมชั่น
          </label>
        </div>

        <div className="filter-group checkbox">
          <label>
            <input
              type="checkbox"
              name="bestSale"
              checked={filters.bestSale}
              onChange={handleChange}
            />
            ขายดี
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShopFilter;
