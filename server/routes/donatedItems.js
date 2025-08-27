const express = require('express');
const router = express.Router();
const DonatedItem = require('../models/DonatedItem');
const InventoryItem = require('../models/InventoryItem');

// Get all donated items
router.get('/', async (req, res) => {
  try {
    const items = await DonatedItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new donated item
router.post('/', async (req, res) => {
  try {
    // Create donated item
    const donatedItem = new DonatedItem(req.body);
    const newDonatedItem = await donatedItem.save();

    // Update inventory item status
    await InventoryItem.findByIdAndUpdate(
      req.body.inventoryItemId,
      { status: 'donated' }
    );

    res.status(201).json(newDonatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single donated item
router.get('/:id', async (req, res) => {
  try {
    const item = await DonatedItem.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete donated item
router.delete('/:id', async (req, res) => {
  try {
    await DonatedItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 