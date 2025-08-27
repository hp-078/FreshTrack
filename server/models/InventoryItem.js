const mongoose = require('mongoose');
const itemSchema = require('./Item');

// Use the base item schema directly since it already includes all needed fields
module.exports = mongoose.model('InventoryItem', itemSchema); 