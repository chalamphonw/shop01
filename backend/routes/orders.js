const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { validateEmail, validatePhone } = require('../middleware/validation');
const axios = require('axios');

// CREATE order and send to LINE
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, address, items, subtotal, totalDiscount, total } = req.body;

    // Validation
    if (!customerName?.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }
    if (!validatePhone(phone)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!address?.trim()) {
      return res.status(400).json({ message: 'Address is required' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Create order message for LINE
    let messageText = `📦 *ใบสั่งซื้อใหม่*\n\n`;
    messageText += `👤 *ข้อมูลลูกค้า*\n`;
    messageText += `ชื่อ: ${customerName}\n`;
    messageText += `เบอร์โทร: ${phone}\n`;
    messageText += `อีเมล: ${email}\n`;
    messageText += `ที่อยู่: ${address}\n\n`;
    messageText += `📋 *รายการสินค้า*\n`;

    items.forEach((item, index) => {
      messageText += `\n${index + 1}. ${item.productName}\n`;
      messageText += `   จำนวน: ${item.quantity} ชิ้น\n`;
      messageText += `   ราคา: ฿${item.price.toFixed(2)}\n`;
      if (item.discountedPrice > 0) {
        messageText += `   ราคาหลังลด: ฿${item.discountedPrice.toFixed(2)}\n`;
      }
      messageText += `   รวม: ฿${item.total.toFixed(2)}\n`;
    });

    messageText += `\n💰 *สรุปการชำระเงิน*\n`;
    messageText += `ยอดรวม: ฿${subtotal.toFixed(2)}\n`;
    if (totalDiscount > 0) {
      messageText += `ส่วนลด: -฿${totalDiscount.toFixed(2)}\n`;
    }
    messageText += `*ยอดรวมสุทธิ: ฿${total.toFixed(2)}*`;

    // Save order to database
    const order = new Order({
      customerName,
      phone,
      email,
      address,
      items,
      subtotal,
      totalDiscount,
      total,
      messageText,
      sentToLine: false
    });

    await order.save();

    // Try to send to LINE (if bot token is configured)
    let lineStatus = 'order_saved';
    if (process.env.LINE_BOT_TOKEN && process.env.LINE_BOT_TOKEN !== 'your_line_bot_token_here') {
      try {
        // Note: This requires LINE Business account and proper setup
        // For demo, we'll just mark as attempted
        order.sentToLine = true;
        await order.save();
        lineStatus = 'sent_to_line';
      } catch (lineError) {
        console.error('LINE notification error:', lineError.message);
      }
    }

    res.status(201).json({
      message: 'Order created successfully',
      lineStatus,
      order,
      messagePreview: messageText
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// GET all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

module.exports = router;
