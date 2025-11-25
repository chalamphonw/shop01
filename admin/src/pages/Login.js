import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { adminApi } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      const response = await adminApi.login(formData.email, formData.password);
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminEmail', response.data.admin.email);
      
      onLogin(response.data.admin);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'ล็อกอินล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo">🔐</div>
          <h1>Admin Panel</h1>
          <p>เข้าสู่ระบบจัดการสินค้า</p>
        </div>

        {error && (
          <div className="error-message">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            <FiLogIn /> {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="login-footer">
          <p>บัญชีทดสอบ:</p>
          <p className="demo-credentials">
            Email: admin@example.com<br />
            Password: Admin@123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
