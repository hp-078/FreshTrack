const API_BASE_URL = 'http://localhost:5000/api';

// Inventory API calls
export const inventoryApi = {
  getAllItems: async () => {
    const response = await fetch(`${API_BASE_URL}/inventory`);
    if (!response.ok) throw new Error('Failed to fetch inventory items');
    return response.json();
  },

  addItem: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error('Failed to add inventory item');
    return response.json();
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update inventory item');
      }
      
      return response.json();
    } catch (error) {
      console.error('Update item error:', error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete inventory item');
    return response.json();
  },

  getItem: async (id) => {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`);
    if (!response.ok) throw new Error('Failed to fetch inventory item');
    return response.json();
  }
};

// Sold Items API calls
export const soldItemsApi = {
  getAllItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sold-items`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch sold items');
      }
      
      const data = await response.json();
      
      // Ensure all numeric fields are properly converted to numbers
      return data.map(item => ({
        ...item,
        quantity: Number(item.quantity || 0),
        buyingPrice: Number(item.buyingPrice || 0),
        sellingPrice: Number(item.sellingPrice || 0),
        soldPrice: Number(item.soldPrice || 0),
        totalPrice: Number(item.totalPrice || 0),
        discount: Number(item.discount || 0)
      }));
    } catch (error) {
      console.error('Error fetching sold items:', error);
      throw error;
    }
  },

  addItem: async (itemData) => {
    try {
      console.log("API: Adding sold item with data:", JSON.stringify(itemData));
      
      // Validate required fields
      const requiredFields = ['inventoryItemId', 'quantity', 'totalPrice', 'sellDate'];
      const missingFields = requiredFields.filter(field => !itemData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Ensure numeric fields are numbers
      if (isNaN(parseFloat(itemData.quantity)) || parseFloat(itemData.quantity) <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      
      if (isNaN(parseFloat(itemData.totalPrice))) {
        throw new Error('Total price must be a valid number');
      }
      
      // Validate date fields
      try {
        new Date(itemData.sellDate);
      } catch (e) {
        throw new Error('Invalid sale date format');
      }
      
      // Make the API call
      const response = await fetch(`${API_BASE_URL}/sold-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process sale');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error adding sold item:', error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sold-items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete sold item');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error deleting sold item:', error);
      throw error;
    }
  }
}; 