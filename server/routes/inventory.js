const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const mongoose = require('mongoose');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    // Format dates before sending to frontend
    const formattedItems = items.map(item => ({
      ...item.toObject(),
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
      expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null
    }));
    res.json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new inventory item
router.post('/', async (req, res) => {
  try {
    // Create new item with form data
    const item = new InventoryItem({
      name: req.body.name,
      quantity: parseInt(req.body.quantity),
      category: req.body.category,
      purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date(),
      expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : null,
      buyingPrice: req.body.buyingPrice ? parseFloat(req.body.buyingPrice) : 0,
      sellingPrice: parseFloat(req.body.sellingPrice),
      image: req.body.image || '',
      isDonated: req.body.isDonated || false,
      isWasted: req.body.isWasted || false,
      discount: req.body.discount || 0
    });

    const newItem = await item.save();
    
    // Format dates before sending response
    const formattedItem = {
      ...newItem.toObject(),
      purchaseDate: newItem.purchaseDate ? new Date(newItem.purchaseDate) : null,
      expirationDate: newItem.expirationDate ? new Date(newItem.expirationDate) : null,
      createdAt: newItem.createdAt ? new Date(newItem.createdAt) : null
    };
    res.status(201).json(formattedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }

    // Find the existing item first
    const existingItem = await InventoryItem.findById(req.params.id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Create update object with form data
    const updateData = {
      name: req.body.name || existingItem.name,
      quantity: parseInt(req.body.quantity) || existingItem.quantity,
      category: req.body.category || existingItem.category,
      purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : existingItem.purchaseDate,
      expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : existingItem.expirationDate,
      buyingPrice: req.body.buyingPrice ? parseFloat(req.body.buyingPrice) : existingItem.buyingPrice,
      sellingPrice: req.body.sellingPrice ? parseFloat(req.body.sellingPrice) : existingItem.sellingPrice,
      image: req.body.image || existingItem.image,
      isDonated: req.body.isDonated ?? existingItem.isDonated,
      isWasted: req.body.isWasted ?? existingItem.isWasted,
      discount: req.body.discount ?? existingItem.discount
    };

    // If marking as wasted, ensure quantity is 0 and not donated
    if (updateData.isWasted) {
      updateData.quantity = 0;
      updateData.isDonated = false;
      updateData.discount = 100;
    }

    // Update the item
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    // Format dates before sending response
    const formattedItem = {
      ...item.toObject(),
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
      expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : null
    };
    res.json(formattedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to update inventory item',
      details: error.errors ? Object.values(error.errors).map(err => err.message) : []
    });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (item) {
      // Format dates before sending response
      const formattedItem = {
        ...item.toObject(),
        purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : null,
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
        createdAt: item.createdAt ? new Date(item.createdAt) : null
      };
      res.json(formattedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 