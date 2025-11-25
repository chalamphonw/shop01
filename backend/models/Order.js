const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  items: [
    {
      productId: String,
      productName: String,
      quantity: Number,
      price: Number,
      discountedPrice: Number,
      total: Number
    }
  ],
  subtotal: Number,
  totalDiscount: Number,
  total: Number,
  sentToLine: {
    type: Boolean,
    default: false
  },
  messageText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
