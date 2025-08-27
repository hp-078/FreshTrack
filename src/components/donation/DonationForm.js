import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Donation.css';
import { useAppContext } from '../../contexts/AppContext';

const DonationForm = ({ onClose, onAdd }) => {
  const { products } = useAppContext();
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    organization: '',
    donationDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the product in inventory
    const product = products.find(p => 
      p.name.toLowerCase() === formData.productName.toLowerCase()
    );

    // Validate product exists
    if (!product) {
      setError('Item not found in inventory. Please check the item name.');
      return;
    }

    // Validate quantity is a positive number
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity greater than 0.');
      return;
    }

    // Check if there's sufficient quantity
    if (quantity > product.quantity) {
      setError(`Insufficient quantity. Only ${product.quantity} items available in inventory.`);
      return;
    }

    // Create donation record
    const donation = {
      id: Date.now(),
      productName: formData.productName,
      quantity: quantity,
      organization: formData.organization,
      donationDate: new Date(formData.donationDate)
    };

    onAdd(donation);
    onClose(); // Close the form after successful submission
  };

  return (
    <div className="donation-form">
      <div className="donation-form-header">
        <h2>Add New Donation</h2>
        <button className="btn-icon" onClick={onClose} aria-label="Close form">
          <X size={20} />
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="donation-form-grid">
          <div className="donation-form-group">
            <label className="donation-form-label" htmlFor="productName">
              Item Name*
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              className="donation-form-input"
              placeholder="Enter item name"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-form-group">
            <label className="donation-form-label" htmlFor="quantity">
              Quantity*
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              className="donation-form-input"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-form-group">
            <label className="donation-form-label" htmlFor="organization">
              Organization Name*
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              className="donation-form-input"
              placeholder="Enter organization name"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="donation-form-group">
            <label className="donation-form-label" htmlFor="donationDate">
              Donation Date*
            </label>
            <input
              id="donationDate"
              name="donationDate"
              type="date"
              className="donation-form-input"
              value={formData.donationDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="donation-form-actions">
          <button
            type="button"
            className="donation-form-button donation-form-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="donation-form-button donation-form-button-primary"
          >
            Add Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm; 