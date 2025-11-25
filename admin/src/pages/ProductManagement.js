import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { adminApi } from '../services/api';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('ไม่สามารถโหลดสินค้า');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, categoryFilter);
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search, category) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.productId.toLowerCase().includes(search)
      );
    }

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('ยืนยันการลบสินค้านี้?')) return;

    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setFilteredProducts(filteredProducts.filter(p => p._id !== id));
      alert('ลบสินค้าสำเร็จ');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('ไม่สามารถลบสินค้า');
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>จัดการสินค้า</h1>
        <button 
          className="btn-add-product"
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          <FiPlus /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {showForm && (
        <AddProductForm 
          product={selectedProduct}
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}

      <div className="filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="ค้นหาชื่อหรือรหัสสินค้า..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <select value={categoryFilter} onChange={handleCategoryFilter}>
          <option value="">ทั้งหมด</option>
          <option value="solar">โซล่าเซลล์</option>
          <option value="software">ซอฟต์แวร์</option>
          <option value="network">เน็ตเวิร์ค</option>
        </select>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>หมวด</th>
              <th>ราคา</th>
              <th>สต๊อก</th>
              <th>โปรโมชั่น</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.productId}</td>
                  <td className="product-name">
                    {product.images?.[0] && (
                      <img src={product.images[0]} alt={product.name} />
                    )}
                    <span>{product.name}</span>
                  </td>
                  <td>
                    {product.category === 'solar' && '🔆 โซล่าเซลล์'}
                    {product.category === 'software' && '💻 ซอฟต์แวร์'}
                    {product.category === 'network' && '🌐 เน็ตเวิร์ค'}
                  </td>
                  <td>฿{product.price.toLocaleString()}</td>
                  <td className={product.stock === 0 ? 'out-of-stock' : ''}>
                    {product.stock}
                  </td>
                  <td>
                    {product.promotion?.isActive ? (
                      <span className="badge promotion">-{product.promotion.discountPercent}%</span>
                    ) : (
                      <span className="badge">-</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-icon view"
                      onClick={() => window.open(`/product/${product._id}`, '_blank')}
                      title="ดูสินค้า"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="btn-icon edit"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
                      }}
                      title="แก้ไข"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteProduct(product._id)}
                      title="ลบ"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  ไม่พบสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || {
      productId: '',
      name: '',
      price: '',
      color: 'white',
      category: 'solar',
      images: [],
      description: '',
      stock: '',
      datasheet: '',
      promotion: { isActive: false, discountPercent: 0 },
      isBestSale: false
    }
  );
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePromotionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [name]: type === 'checkbox' ? checked : parseInt(value)
      }
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert('อัปโหลดได้ไม่เกิน 4 ไฟล์');
      return;
    }

    try {
      setLoading(true);
      const response = await adminApi.uploadFiles(files);
      setFormData(prev => ({
        ...prev,
        images: response.data.urls
      }));
      setLoading(false);
    } catch (error) {
      alert('ไม่สามารถอัปโหลดไฟล์');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.name || !formData.price || !formData.description || !formData.stock) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      if (product) {
        await adminApi.updateProduct(product._id, formData);
        alert('อัปเดตสินค้าสำเร็จ');
      } else {
        await adminApi.createProduct(formData);
        alert('เพิ่มสินค้าสำเร็จ');
      }
      onSave();
    } catch (error) {
      alert(error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>รหัสสินค้า *</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                disabled={!!product}
              />
            </div>

            <div className="form-group">
              <label>ชื่อสินค้า *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ราคา *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>สี</label>
              <select name="color" value={formData.color} onChange={handleChange}>
                <option value="white">ขาว</option>
                <option value="black">ดำ</option>
              </select>
            </div>

            <div className="form-group">
              <label>หมวดหมู่</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="solar">โซล่าเซลล์</option>
                <option value="software">ซอฟต์แวร์</option>
                <option value="network">เน็ตเวิร์ค</option>
              </select>
            </div>

            <div className="form-group">
              <label>จำนวนสต๊อก *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full">
            <label>รายละเอียด *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group full">
            <label>อัปโหลดภาพ (สูงสุด 4 ไฟล์)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={loading}
            />
            {formData.images.length > 0 && (
              <div className="image-preview">
                {formData.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Preview ${idx + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className="form-group full">
            <label className="checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.promotion.isActive}
                onChange={handlePromotionChange}
              />
              เปิดใช้งานโปรโมชั่น
            </label>
          </div>

          {formData.promotion.isActive && (
            <div className="form-group">
              <label>ส่วนลด (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.promotion.discountPercent}
                onChange={handlePromotionChange}
                min="0"
                max="100"
              />
            </div>
          )}

          <div className="form-group">
            <label className="checkbox">
              <input
                type="checkbox"
                name="isBestSale"
                checked={formData.isBestSale}
                onChange={handleChange}
              />
              ขายดี
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
