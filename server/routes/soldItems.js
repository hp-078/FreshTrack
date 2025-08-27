const express = require('express');
const router = express.Router();
const SoldItem = require('../models/SoldItem');
const InventoryItem = require('../models/InventoryItem');
const mongoose = require('mongoose');

// Get all sold items
router.get('/', async (req, res) => {
  try {
    const soldItems = await SoldItem.find().sort({ soldDate: -1 });
    // Format dates and ensure numeric fields before sending to frontend
    const formattedItems = soldItems.map(item => {
      const obj = item.toObject();
      return {
        ...obj,
        soldDate: obj.soldDate ? new Date(obj.soldDate).toISOString() : null,
        sellDate: obj.soldDate ? new Date(obj.soldDate).toISOString() : null, // For frontend compatibility
        purchaseDate: obj.purchaseDate ? new Date(obj.purchaseDate).toISOString() : null,
        expirationDate: obj.expirationDate ? new Date(obj.expirationDate).toISOString() : null,
        createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : null,
        // Ensure numeric fields are numbers
        quantity: Number(obj.quantity),
        buyingPrice: Number(obj.buyingPrice),
        sellingPrice: Number(obj.sellingPrice),
        soldPrice: Number(obj.soldPrice),
        totalPrice: Number(obj.totalPrice),
        discount: Number(obj.discount || 0)
      };
    });
    res.json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new sold item
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'inventoryItemId', 'name', 'category', 'quantity', 'buyingPrice',
      'sellingPrice', 'soldPrice', 'totalPrice', 'sellDate'
    ];

    const missingFields = requiredFields.filter(field => 
      req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
    );
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Find the inventory item
    const inventoryItem = await InventoryItem.findById(req.body.inventoryItemId).session(session);
    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    // Validate quantity
    if (req.body.quantity > inventoryItem.quantity) {
      throw new Error(`Insufficient quantity available. Only ${inventoryItem.quantity} units in stock.`);
    }

    if (req.body.quantity <= 0) {
      throw new Error('Invalid quantity. Quantity must be greater than 0.');
    }

    // Process dates
    let soldDate, purchaseDate, expirationDate;
    
    try {
      soldDate = req.body.sellDate ? new Date(req.body.sellDate) : new Date();
      
      // Validate that soldDate is not in the future
      if (soldDate > new Date()) {
        throw new Error('Sale date cannot be in the future');
      }
      
      purchaseDate = req.body.purchaseDate ? new Date(req.body.purchaseDate) : null;
      expirationDate = req.body.expirationDate ? new Date(req.body.expirationDate) : null;
    } catch (error) {
      throw new Error(`Date parsing error: ${error.message}`);
    }

    // Create sold item
    const soldItem = new SoldItem({
      inventoryItemId: req.body.inventoryItemId,
      name: req.body.name,
      category: req.body.category,
      quantity: Number(req.body.quantity),
      buyingPrice: Number(req.body.buyingPrice),
      sellingPrice: Number(req.body.sellingPrice),
      soldPrice: Number(req.body.soldPrice),
      totalPrice: Number(req.body.totalPrice),
      soldDate: soldDate,
      purchaseDate: purchaseDate,
      expirationDate: expirationDate,
      discount: Number(req.body.discount || 0)
    });

    console.log("Sold item to save:", soldItem);

    // Save the sold item
    const newSoldItem = await soldItem.save({ session });

    // Update inventory quantity
    inventoryItem.quantity -= req.body.quantity;
    
    // If quantity becomes 0, mark as wasted
    if (inventoryItem.quantity === 0) {
      inventoryItem.isWasted = true;
      inventoryItem.discount = 100;
    }
    
    await inventoryItem.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Format dates for response
    const formattedItem = {
      ...newSoldItem.toObject(),
      soldDate: newSoldItem.soldDate ? newSoldItem.soldDate.toISOString() : null,
      sellDate: newSoldItem.soldDate ? newSoldItem.soldDate.toISOString() : null, // For frontend compatibility
      purchaseDate: newSoldItem.purchaseDate ? newSoldItem.purchaseDate.toISOString() : null,
      expirationDate: newSoldItem.expirationDate ? newSoldItem.expirationDate.toISOString() : null,
      createdAt: newSoldItem.createdAt ? newSoldItem.createdAt.toISOString() : null
    };

    res.status(201).json(formattedItem);
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();
    
    console.error('Sell item error:', error.message);
    
    res.status(400).json({ 
      message: error.message || 'Failed to process sale',
      details: error.errors ? Object.values(error.errors).map(err => err.message) : []
    });
  }
});

// Get single sold item
router.get('/:id', async (req, res) => {
  try {
    const item = await SoldItem.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete sold item
router.delete('/:id', async (req, res) => {
  try {
    await SoldItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fix existing records with string numeric values
router.post('/fix-data', async (req, res) => {
  try {
    // Find all sold items
    const soldItems = await SoldItem.find();
    let fixedCount = 0;
    
    // Update each item to ensure numeric fields are properly stored as numbers
    for (const item of soldItems) {
      const needsFix = 
        typeof item.quantity !== 'number' || 
        typeof item.buyingPrice !== 'number' ||
        typeof item.sellingPrice !== 'number' ||
        typeof item.soldPrice !== 'number' ||
        typeof item.totalPrice !== 'number' ||
        typeof item.discount !== 'number';
        
      if (needsFix) {
        item.quantity = Number(item.quantity);
        item.buyingPrice = Number(item.buyingPrice);
        item.sellingPrice = Number(item.sellingPrice);
        item.soldPrice = Number(item.soldPrice);
        item.totalPrice = Number(item.totalPrice);
        item.discount = Number(item.discount || 0);
        
        await item.save();
        fixedCount++;
      }
    }
    
    res.json({ 
      message: 'Data migration completed', 
      processed: soldItems.length,
      fixed: fixedCount 
    });
  } catch (error) {
    console.error('Data fix error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Migration route to update schema
router.post('/migrate', async (req, res) => {
  try {
    const soldItems = await SoldItem.find();
    let updatedCount = 0;
    
    for (const item of soldItems) {
      // Ensure totalPrice exists
      if (!item.totalPrice) {
        // Calculate total price from quantity and soldPrice
        const totalPrice = item.quantity * item.soldPrice;
        item.totalPrice = totalPrice;
        await item.save();
        updatedCount++;
      }
    }
    
    res.json({
      message: 'Migration completed successfully',
      totalItems: soldItems.length,
      updatedItems: updatedCount
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 