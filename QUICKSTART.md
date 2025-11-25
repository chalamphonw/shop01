## Quick Start Guide

### ขั้นตอนที่ 1: เตรียมสิ่งแวดล้อม

**ความต้องการ:**
- Node.js >= 16
- npm หรือ yarn
- MongoDB Atlas Account (ฟรี)

### ขั้นตอนที่ 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# แก้ไข .env ด้วย MongoDB URI และข้อมูลอื่นๆ
npm run seed     # สร้าง sample data
npm run dev      # เปิด Backend server
```

### ขั้นตอนที่ 3: Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm start        # เปิด Shop ที่ localhost:3000
```

### ขั้นตอนที่ 4: Setup Admin

```bash
cd ../admin
npm install
cp .env.example .env
npm start        # เปิด Admin ที่ localhost:3001
```

---

## ✅ Checklist ก่อน Deploy

- [ ] ทดสอบ Backend API ด้วย Postman หรือ curl
- [ ] ทดสอบเพิ่มสินค้า Admin panel
- [ ] ทดสอบ Checkout process
- [ ] ตั้งค่า MongoDB Atlas
- [ ] เตรียม Render/Railway account
- [ ] เตรียม Vercel account
- [ ] เพิ่ม Environment variables ทั้งหมด

---

## 🎯 Deployment URLs (หลังจาก Deploy)

- Frontend: `https://your-shop.vercel.app`
- Admin: `https://your-admin.vercel.app`
- Backend: `https://your-api.railway.app` หรือ `.render.com`

แก้ไข Frontend/Admin `.env` ให้ชี้ไปยัง Backend URL จริง
