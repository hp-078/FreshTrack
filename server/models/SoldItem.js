const mongoose = require('mongoose');
const itemSchema = require('./Item');

const soldItemSchema = new mongoose.Schema({
  ...itemSchema.obj,
  soldDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  soldPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SoldItem', soldItemSchema); 