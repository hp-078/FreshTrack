import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { X, AlertCircle } from 'lucide-react';
import './Sell.css';

const SellForm = ({ product, onClose, onSell }) => {
  const { addSellTransaction } = useAppContext();
  const [formData, setFormData] = useState({
    quantity: 1,
    saleDate: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate when product changes - ensure it can be sold
  useEffect(() => {
    if (!product || product.quantity <= 0 || product.isWasted || product.isDonated) {
      setErrors({
        product: 'This product cannot be sold. It may be out of stock, wasted, or donated.'
      });
    } else {
      setErrors({});
    }
  }, [product]);

  // Calculate total price with discount
  const discountedPrice = product.sellingPrice * (1 - (product.discount / 100));
  const totalPrice = formData.quantity * discountedPrice;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user edits
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Product validation
    if (!product || !product._id) {
      newErrors.product = 'Invalid product data';
    }

    if (product.quantity <= 0) {
      newErrors.product = 'Product is out of stock';
    }

    // Quantity validation
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (formData.quantity > product.quantity) {
      newErrors.quantity = `Cannot sell more than available (${product.quantity})`;
    }

    // Date validation
    if (!formData.saleDate) {
      newErrors.saleDate = 'Sale date is required';
    } else {
      const saleDate = new Date(formData.saleDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (saleDate > today) {
        newErrors.saleDate = 'Sale date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
      // Focus the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField && document.getElementById(firstErrorField)) {
        document.getElementById(firstErrorField).focus();
      }
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create sell transaction with all required fields
      const sellTransaction = {
        inventoryItemId: product._id,
        name: product.name,
        category: product.category,
        quantity: parseInt(formData.quantity),
        buyingPrice: Number(product.buyingPrice),
        sellingPrice: Number(product.sellingPrice),
        soldPrice: Number(discountedPrice),
        totalPrice: Number(totalPrice),
        sellDate: new Date(formData.saleDate).toISOString(),
        purchaseDate: product.purchaseDate ? new Date(product.purchaseDate).toISOString() : null,
        expirationDate: product.expirationDate ? new Date(product.expirationDate).toISOString() : null,
        discount: Number(product.discount || 0)
      };

      // Process the sale using context
      const newTransaction = await addSellTransaction(sellTransaction);
      
      if (!newTransaction) {
        throw new Error('Failed to process sale');
      }

      // Show success message
      alert('Sale processed successfully!');

      // Call onSell callback with transaction data
      onSell(newTransaction);
    } catch (error) {
      console.error('Sale error:', error);
      alert(error.message || 'Failed to process sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If product can't be sold, show an error message
  if (errors.product && !formData.quantity) {
    return (
      <div className="sell-form">
        <div className="sell-form-header">
          <h2>Cannot Sell Product</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close form">
            <X size={20} />
          </button>
        </div>
        <div className="sell-form-error-message">
          <AlertCircle size={24} />
          <p>{errors.product}</p>
        </div>
        <div className="sell-form-actions">
          <button
            type="button"
            className="sell-form-button sell-form-button-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sell-form">
      <div className="sell-form-header">
        <h2>Sell Product</h2>
        <button className="btn-icon" onClick={onClose} aria-label="Close form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="sell-form-grid">
          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="productName">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              className="sell-form-input"
              value={product.name}
              disabled
            />
          </div>

          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="quantity">
              Quantity* (Max: {product.quantity})
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              className={`sell-form-input ${errors.quantity ? 'sell-form-input-error' : ''}`}
              min="1"
              max={product.quantity}
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            {errors.quantity && <div className="sell-form-error">{errors.quantity}</div>}
          </div>

          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="price">
              Price per Item
            </label>
            <input
              id="price"
              type="text"
              className="sell-form-input"
              value={`₹${discountedPrice.toFixed(2)}${product.discount > 0 ? ` (${product.discount}% OFF)` : ''}`}
              disabled
            />
          </div>

          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="totalPrice">
              Total Price
            </label>
            <input
              id="totalPrice"
              type="text"
              className="sell-form-input"
              value={`₹${totalPrice.toFixed(2)}`}
              disabled
            />
          </div>

          <div className="sell-form-group">
            <label className="sell-form-label" htmlFor="saleDate">
              Sale Date*
            </label>
            <input
              id="saleDate"
              name="saleDate"
              type="date"
              className={`sell-form-input ${errors.saleDate ? 'sell-form-input-error' : ''}`}
              value={formData.saleDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.saleDate && <div className="sell-form-error">{errors.saleDate}</div>}
          </div>
        </div>

        <div className="sell-form-actions">
          <button
            type="button"
            className="sell-form-button sell-form-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="sell-form-button sell-form-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Process Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellForm; 