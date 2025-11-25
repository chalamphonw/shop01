import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', formData);
    setSuccess(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>ติดต่อเรา</h1>
        <p>เรายินดีที่จะตอบคำถามของคุณ</p>
      </div>

      <div className="contact-container">
        <div className="contact-form-section">
          <h2>ส่งข้อความถึงเรา</h2>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">ชื่อ *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">อีเมล *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">เบอร์โทรศัพท์ *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">ข้อความ *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-send">
              ส่งข้อความ
            </button>

            {success && (
              <div className="success-message">
                ✓ ส่งข้อความสำเร็จ เราจะติดต่อกลับในเร็วๆ นี้
              </div>
            )}
          </form>
        </div>

        <div className="contact-info">
          <h2>ข้อมูลการติดต่อ</h2>

          <div className="info-group">
            <div className="info-item">
              <div className="info-icon"><FiPhone /></div>
              <div>
                <h4>เบอร์โทร</h4>
                <p>+66 (0) 2-xxx-xxxx</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FiMail /></div>
              <div>
                <h4>อีเมล</h4>
                <p>info@example.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FiMapPin /></div>
              <div>
                <h4>ที่อยู่</h4>
                <p>Bangkok, Thailand</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FiClock /></div>
              <div>
                <h4>เวลาเปิดทำการ</h4>
                <p>จันทร์ - ศุกร์ 9:00 - 18:00 น.</p>
                <p>วันเสาร์ 10:00 - 16:00 น.</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <h4>ติดตามเรา</h4>
            <div className="social-buttons">
              <a href="#" className="social-btn line">LINE</a>
              <a href="#" className="social-btn facebook">Facebook</a>
              <a href="#" className="social-btn instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h2>ตำแหน่งที่ตั้ง</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.1825259289887!2d100.54810631586396!3d13.736717397456154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d612be80e23d7%3A0x3fbff16f11800ea0!2sCentralWorld!5e0!3m2!1sth!2sth!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
