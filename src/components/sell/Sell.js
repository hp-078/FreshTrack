import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Search, RefreshCw, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SellForm from './SellForm';
import { inventoryApi, soldItemsApi } from '../../services/api';
import './Sell.css';

// Import base URL from the API file
const API_BASE_URL = 'http://localhost:5000/api';

const Sell = () => {
  const { 
    products, 
    sellTransactions, 
    addSellTransaction,
    dispatch 
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [itemFilter, setItemFilter] = useState('available');
  const [dateRange, setDateRange] = useState(() => {
    // Calculate dates for past 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  });
  const [dateRangeSelected, setDateRangeSelected] = useState(true); // Start with true to show stats immediately
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'ascending'
  });
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get all unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products based on item filter
  const getFilteredProducts = () => {
    if (itemFilter === 'available') {
      return products.filter(product => 
        !product.isDonated && !product.isWasted && product.quantity > 0
      );
    } else {
      // For sold items, we'll show products that have been sold
      return products.filter(product => 
        sellTransactions.some(transaction => transaction.inventoryItemId === product._id)
      );
    }
  };

  // Update availableProducts to use the new filter
  const availableProducts = getFilteredProducts();

  // Calculate total sales statistics with date range
  const filteredTransactions = sellTransactions && dateRangeSelected ? sellTransactions.filter(transaction => {
    if (!transaction.soldDate && !transaction.sellDate) return false;
    const transactionDate = new Date(transaction.soldDate || transaction.sellDate).toISOString().split('T')[0];
    return transactionDate >= dateRange.startDate && transactionDate <= dateRange.endDate;
  }) : [];

  // Calculate totals only when date range has been selected
  const totalSoldItems = dateRangeSelected ? filteredTransactions.reduce((acc, transaction) => 
    acc + (parseInt(transaction.quantity) || 0), 0) : 0;

  const totalSalesValue = dateRangeSelected ? filteredTransactions.reduce((acc, transaction) => {
    // Create a definite number for totalPrice
    const price = Number(transaction.totalPrice || 0);
    return acc + price;
  }, 0) : 0;

  // Ensure it's a number for display
  const displayTotalSales = isNaN(totalSalesValue) ? 0 : totalSalesValue;

  const totalTransactions = dateRangeSelected ? filteredTransactions.length : 0;

  // Handle date range changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Statistics are always shown now, no need to set it explicitly
    // But we'll ensure it's true just in case
    if (!dateRangeSelected) {
      setDateRangeSelected(true);
    }
  };

  // Handle search and filtering
  const filteredProducts = availableProducts.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory ? product.category === filterCategory : true;
    return searchMatch && categoryMatch;
  });

  // Sorting function
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Request a sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Handle sell button click
  const handleSell = (product) => {
    setSelectedProduct(product);
    setShowSellForm(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setSortConfig({ key: '', direction: 'ascending' });
    
    // Reset date range to the past 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    setDateRange({
      startDate: sevenDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
    
    // Keep date selection state true to continue showing statistics
    setDateRangeSelected(true);
  };

  // Handle sell transaction
  const handleSellTransaction = (transaction) => {
    // Force a full refresh of products and transactions from the database
    const fetchLatestData = async () => {
      try {
        const [products, soldItems] = await Promise.all([
          inventoryApi.getAllItems(),
          soldItemsApi.getAllItems()
        ]);
        
        // Update state directly from API to ensure consistency
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        dispatch({ type: 'SET_SELL_TRANSACTIONS', payload: soldItems });
        
        // Close the form and reset selected product after confirming data refresh
        setShowSellForm(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error refreshing data after sale:", error);
      }
    };
    
    // Trigger the refresh
    fetchLatestData();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70
      }
    }
  };

  // Extract sold transaction history when needed
  const showSoldHistory = itemFilter === 'sold';
  
  // Get transaction history for a specific timeframe
  const getTransactionHistory = () => {
    if (!showSoldHistory) return null;
    
    return (
      <motion.div className="sell-history" variants={itemVariants}>
        <h2>Sales History</h2>
        <div className="overflow-x-auto">
          <table className="sell-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Sale Price</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <motion.tr key={transaction._id} variants={itemVariants}>
                  <td>{transaction.name}</td>
                  <td>{transaction.quantity}</td>
                  <td>₹{parseFloat(transaction.soldPrice || 0).toFixed(2)}</td>
                  <td>₹{parseFloat(transaction.totalPrice || 0).toFixed(2)}</td>
                  <td>{new Date(transaction.soldDate || transaction.sellDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="sell-empty-state">
            <ShoppingBag size={48} className="mb-4" />
            <h3>No Sales Found</h3>
            <p>No sales have been recorded in the selected date range.</p>
          </div>
        )}
      </motion.div>
    );
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      try {
        await soldItemsApi.deleteItem(id);
        
        // Refresh the data from server
        const soldItems = await soldItemsApi.getAllItems();
        dispatch({ type: 'SET_SELL_TRANSACTIONS', payload: soldItems });
        
        alert('Transaction deleted successfully.');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert(`Failed to delete transaction: ${error.message}`);
      }
    }
  };

  // Add a function to fix data issues
  const fixDataIssues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sold-items/fix-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fix data issues");
      }
      
      const result = await response.json();
      alert(`Data migration complete: ${result.fixed} records fixed out of ${result.processed} total`);
      
      // Refresh data after fix
      const soldItems = await soldItemsApi.getAllItems();
      dispatch({ type: 'SET_SELL_TRANSACTIONS', payload: soldItems });
    } catch (error) {
      console.error("Error fixing data:", error);
      alert(`Error fixing data: ${error.message}`);
    }
  };

  // Add a function to migrate data
  const migrateDatabase = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sold-items/migrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to migrate database");
      }
      
      const result = await response.json();
      alert(`Migration complete: ${result.updatedItems} records updated out of ${result.totalItems} total`);
      
      // Refresh data after migration
      const soldItems = await soldItemsApi.getAllItems();
      dispatch({ type: 'SET_SELL_TRANSACTIONS', payload: soldItems });
    } catch (error) {
      console.error("Error migrating database:", error);
      alert(`Error migrating database: ${error.message}`);
    }
  };

  // Add a button to migrate database to the AdminTools component
  const AdminTools = () => (
    <div className="sell-admin-tools">
      {/* <button 
        className="btn btn-secondary btn-sm"
        onClick={fixDataIssues}
        title="Fix data issues in the database"
      >
        Fix Data Issues
      </button>
      <button 
        className="btn btn-secondary btn-sm"
        onClick={migrateDatabase}
        title="Migrate database schema"
      >
        Migrate Schema
      </button> */}
    </div>
  );

  return (
    <motion.div
      className="sell"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="sell-header">
        <h1>Sales Management</h1>
      </div>

      <motion.div className="card" variants={itemVariants}>
        {dateRangeSelected ? (
          <div className="sell-summary">
            <div className="sell-stats">
              <h3>{totalTransactions}</h3>
              <p>Total Sales</p>
            </div>
            <div className="sell-stats">
              <h3>{totalSoldItems}</h3>
              <p>Items Sold</p>
            </div>
            <div className="sell-stats">
              <h3>₹{displayTotalSales.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="sell-date-indicator">
              Showing data from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="sell-summary sell-summary-empty">
            <div className="sell-stats-message">
              <p>Select a date range to view sales statistics</p>
            </div>
          </div>
        )}
        <div className="sell-date-range">
          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="sell-form-input"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
          </div>
          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="sell-form-input"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </div>
          <div className="sell-form-group sell-date-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={resetFilters}
              title="Reset to past 7 days"
            >
              <RefreshCw size={16} />
              Last 7 Days
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div className="card" variants={itemVariants}>
        <div className="sell-filters">
          <div className="sell-search">
            <input
              type="text"
              className="form-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="sell-search-icon" size={18} />
          </div>

          <div className="form-group">
            <select
              className="form-input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              className="form-input"
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
            >
              <option value="available">Available Items</option>
              <option value="sold">Sold Items</option>
            </select>
          </div>

          <div className="sell-reset-button">
            <button className="btn btn-secondary" onClick={resetFilters}>
              <RefreshCw size={16} />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {itemFilter === 'available' ? (
            <table className="sell-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')} 
                      style={{ cursor: 'pointer' }}>
                    Name {getSortDirectionIndicator('name')}
                  </th>
                  <th onClick={() => requestSort('category')} 
                      style={{ cursor: 'pointer' }}>
                    Category {getSortDirectionIndicator('category')}
                  </th>
                  <th onClick={() => requestSort('quantity')} 
                      style={{ cursor: 'pointer' }}>
                    Quantity {getSortDirectionIndicator('quantity')}
                  </th>
                  <th onClick={() => requestSort('sellingPrice')} 
                      style={{ cursor: 'pointer' }}>
                    Price {getSortDirectionIndicator('sellingPrice')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => {
                  const discountedPrice = product.sellingPrice * (1 - (product.discount / 100));
                  return (
                    <motion.tr
                      key={product.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50"
                    >
                      <td className="sell-product-name">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="sell-product-image"
                          />
                        )}
                        <div>
                          <div>{product.name}</div>
                          {product.discount > 0 && (
                            <span className="sell-badge sell-badge-warning">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.quantity}</td>
                      <td>₹{discountedPrice.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSell(product)}
                        >
                          
                          Sell
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>

        {/* Display different content based on filter */}
        {itemFilter === 'available' ? (
          sortedProducts.length === 0 && (
            <div className="sell-empty-state">
              <ShoppingBag size={48} className="mb-4" />
              <h3>No Products Found</h3>
              <p>Add some products to your inventory to start selling.</p>
            </div>
          )
        ) : (
          getTransactionHistory()
        )}
      </motion.div>

      <AnimatePresence>
        {showSellForm && selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SellForm
              product={selectedProduct}
              onClose={() => {
                setShowSellForm(false);
                setSelectedProduct(null);
              }}
              onSell={handleSellTransaction}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AdminTools />
    </motion.div>
  );
};

export default Sell; 