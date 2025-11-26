require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const sampleProducts = [
  // Solar Products
  {
    productId: 'SOLAR001',
    name: 'Solar Panel 400W Monocrystalline',
    price: 15000,
    color: 'black',
    category: 'solar',
    images: ['/uploads/solar1-1.jpg', '/uploads/solar1-2.jpg', '/uploads/solar1-3.jpg', '/uploads/solar1-4.jpg'],
    description: 'High-efficiency solar panel with advanced monocrystalline technology. Perfect for residential and commercial installations.',
    stock: 50,
    datasheet: '/uploads/solar-panel-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 15 },
    isBestSale: true,
    salesCount: 120
  },
  {
    productId: 'SOLAR002',
    name: 'Solar Battery Storage 48V 100Ah',
    price: 50000,
    color: 'white',
    category: 'solar',
    images: ['/uploads/battery1-1.jpg', '/uploads/battery1-2.jpg', '/uploads/battery1-3.jpg', '/uploads/battery1-4.jpg'],
    description: 'High-capacity lithium battery storage system with built-in BMS. Ideal for off-grid applications.',
    stock: 20,
    datasheet: '/uploads/battery-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 10 },
    isBestSale: true,
    salesCount: 45
  },
  {
    productId: 'SOLAR003',
    name: 'Solar Inverter 5000W',
    price: 25000,
    color: 'black',
    category: 'solar',
    images: ['/uploads/inverter1-1.jpg', '/uploads/inverter1-2.jpg', '/uploads/inverter1-3.jpg', '/uploads/inverter1-4.jpg'],
    description: 'Hybrid solar inverter with dual MPPT tracking. Supports grid-tied and off-grid operation.',
    stock: 35,
    datasheet: '/uploads/inverter-datasheet.pdf',
    promotion: { isActive: false, discountPercent: 0 },
    isBestSale: false,
    salesCount: 28
  },
  {
    productId: 'SOLAR004',
    name: 'Solar Mounting Bracket Set',
    price: 5000,
    color: 'black',
    category: 'solar',
    images: ['/uploads/bracket1-1.jpg', '/uploads/bracket1-2.jpg', '/uploads/bracket1-3.jpg', '/uploads/bracket1-4.jpg'],
    description: 'Aluminum mounting brackets for rooftop solar installation. Corrosion-resistant and durable.',
    stock: 100,
    datasheet: '/uploads/bracket-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 20 },
    isBestSale: false,
    salesCount: 156
  },

  // Software Products
  {
    productId: 'SW001',
    name: 'Solar Monitoring Software License (1 Year)',
    price: 3000,
    color: 'white',
    category: 'software',
    images: ['/uploads/software1-1.jpg', '/uploads/software1-2.jpg', '/uploads/software1-3.jpg', '/uploads/software1-4.jpg'],
    description: 'Cloud-based monitoring software with real-time analytics and mobile app access.',
    stock: 999,
    datasheet: '/uploads/software-license-datasheet.pdf',
    promotion: { isActive: false, discountPercent: 0 },
    isBestSale: true,
    salesCount: 340
  },
  {
    productId: 'SW002',
    name: 'Energy Management System Software',
    price: 8000,
    color: 'black',
    category: 'software',
    images: ['/uploads/energy-software-1.jpg', '/uploads/energy-software-2.jpg', '/uploads/energy-software-3.jpg', '/uploads/energy-software-4.jpg'],
    description: 'Advanced energy management and optimization software for commercial installations.',
    stock: 50,
    datasheet: '/uploads/energy-management-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 25 },
    isBestSale: false,
    salesCount: 62
  },
  {
    productId: 'SW003',
    name: 'Maintenance & Support Service (3 Years)',
    price: 12000,
    color: 'white',
    category: 'software',
    images: ['/uploads/support-service-1.jpg', '/uploads/support-service-2.jpg', '/uploads/support-service-3.jpg', '/uploads/support-service-4.jpg'],
    description: 'Premium maintenance and technical support package with 24/7 helpdesk access.',
    stock: 30,
    datasheet: '/uploads/support-service-datasheet.pdf',
    promotion: { isActive: false, discountPercent: 0 },
    isBestSale: true,
    salesCount: 88
  },

  // Network Products
  {
    productId: 'NET001',
    name: 'Smart Meter & Monitoring Gateway',
    price: 7500,
    color: 'white',
    category: 'network',
    images: ['/uploads/gateway1-1.jpg', '/uploads/gateway1-2.jpg', '/uploads/gateway1-3.jpg', '/uploads/gateway1-4.jpg'],
    description: 'IoT gateway for smart metering and real-time monitoring. WiFi + Ethernet connectivity.',
    stock: 45,
    datasheet: '/uploads/gateway-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 12 },
    isBestSale: false,
    salesCount: 95
  },
  {
    productId: 'NET002',
    name: 'Network Switch 48 Port Gigabit',
    price: 18000,
    color: 'black',
    category: 'network',
    images: ['/uploads/switch1-1.jpg', '/uploads/switch1-2.jpg', '/uploads/switch1-3.jpg', '/uploads/switch1-4.jpg'],
    description: 'Managed gigabit switch for large-scale installations. Perfect for data centers and solar farms.',
    stock: 15,
    datasheet: '/uploads/switch-datasheet.pdf',
    promotion: { isActive: false, discountPercent: 0 },
    isBestSale: true,
    salesCount: 34
  },
  {
    productId: 'NET003',
    name: 'WiFi Extender Pro 5G',
    price: 4500,
    color: 'white',
    category: 'network',
    images: ['/uploads/wifi-extender-1.jpg', '/uploads/wifi-extender-2.jpg', '/uploads/wifi-extender-3.jpg', '/uploads/wifi-extender-4.jpg'],
    description: 'High-speed WiFi 6 extender for extended network coverage. Dual-band support.',
    stock: 60,
    datasheet: '/uploads/wifi-extender-datasheet.pdf',
    promotion: { isActive: true, discountPercent: 18 },
    isBestSale: false,
    salesCount: 142
  },
  {
    productId: 'NET004',
    name: 'Network Fiber Optic Cable Kit (1km)',
    price: 22000,
    color: 'black',
    category: 'network',
    images: ['/uploads/fiber-cable-1.jpg', '/uploads/fiber-cable-2.jpg', '/uploads/fiber-cable-3.jpg', '/uploads/fiber-cable-4.jpg'],
    description: 'Premium single-mode fiber optic cable with connectors. Long-distance transmission.',
    stock: 10,
    datasheet: '/uploads/fiber-cable-datasheet.pdf',
    promotion: { isActive: false, discountPercent: 0 },
    isBestSale: false,
    salesCount: 18
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} sample products`);

    // Create default admin if not exists
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Created default admin account');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    } else {
      console.log('ℹ️ Admin account already exists');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
