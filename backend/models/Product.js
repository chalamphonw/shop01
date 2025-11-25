const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    enum: ['white', 'black'],
    required: true
  },
  category: {
    type: String,
    enum: ['solar', 'software', 'network'],
    required: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length <= 4;
      },
      message: 'Maximum 4 images allowed'
    }
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  datasheet: {
    type: String,
    default: null
  },
  promotion: {
    isActive: {
      type: Boolean,
      default: false
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    discountedPrice: {
      type: Number,
      default: 0
    }
  },
  isBestSale: {
    type: Boolean,
    default: false
  },
  salesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate discounted price
ProductSchema.pre('save', function(next) {
  if (this.promotion.isActive && this.promotion.discountPercent > 0) {
    this.promotion.discountedPrice = this.price - (this.price * this.promotion.discountPercent / 100);
  } else {
    this.promotion.discountedPrice = 0;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
