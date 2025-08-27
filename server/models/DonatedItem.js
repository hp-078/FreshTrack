const mongoose = require('mongoose');
const itemSchema = require('./Item');

const donatedItemSchema = new mongoose.Schema({
  ...itemSchema.obj,
  donatedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  donorName: {
    type: String,
    required: true
  },
  donorContact: {
    type: String,
    required: true
  },
  recipientOrganization: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('DonatedItem', donatedItemSchema); 