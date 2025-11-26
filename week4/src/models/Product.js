const mongoose = require('mongoose');

// define Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 // price cannot be negative
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field: discountedPrice (example: 10% off)
productSchema.virtual('discountedPrice').get(function() {
  return this.price * 0.9;
});

// Compound index: { status: 1, createdAt: -1 }
productSchema.index({ status: 1, createdAt: -1 });

// create Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
