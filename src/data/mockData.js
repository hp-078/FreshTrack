Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockWasteReduction = exports.mockProducts = exports.mockNotifications = exports.mockDonations = exports.mockChartData = exports.mockSellTransactions = void 0;
// Helper function to create date objects with specific day offsets
const createDate = daysOffset => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

// Sample products data
const mockProducts = exports.mockProducts = [{
  id: '1',
  name: 'Organic Milk',
  quantity: 2,
  purchaseDate: createDate(-3),
  expirationDate: createDate(5),
  discount: 0,
  category: 'Dairy',
  isDonated: false,
  isWasted: false,
  buyingPrice: 2.50,
  sellingPrice: 3.99,
  image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '2',
  name: 'Fresh Tomatoes',
  quantity: 6,
  purchaseDate: createDate(-2),
  expirationDate: createDate(2),
  discount: 50,
  category: 'Vegetables',
  isDonated: false,
  isWasted: false,
  buyingPrice: 1.00,
  sellingPrice: 1.99,
  image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '3',
  name: 'Whole Wheat Bread',
  quantity: 1,
  purchaseDate: createDate(-4),
  expirationDate: createDate(1),
  discount: 75,
  category: 'Bakery',
  isDonated: false,
  isWasted: false,
  buyingPrice: 2.00,
  sellingPrice: 3.99,
  image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '4',
  name: 'Chicken Breast',
  quantity: 3,
  purchaseDate: createDate(-1),
  expirationDate: createDate(3),
  discount: 25,
  category: 'Meat',
  isDonated: false,
  isWasted: false,
  buyingPrice: 5.00,
  sellingPrice: 7.99,
  image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '5',
  name: 'Greek Yogurt',
  quantity: 4,
  purchaseDate: createDate(-5),
  expirationDate: createDate(0),
  discount: 75,
  category: 'Dairy',
  isDonated: true,
  isWasted: false,
  buyingPrice: 1.50,
  sellingPrice: 2.99,
  image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '6',
  name: 'Bananas',
  quantity: 6,
  purchaseDate: createDate(-2),
  expirationDate: createDate(2),
  discount: 50,
  category: 'Fruits',
  isDonated: false,
  isWasted: false,
  buyingPrice: 0.75,
  sellingPrice: 1.99,
  image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '7',
  name: 'Fresh Eggs',
  quantity: 12,
  purchaseDate: createDate(-7),
  expirationDate: createDate(7),
  discount: 0,
  category: 'Dairy',
  isDonated: false,
  isWasted: false,
  buyingPrice: 2.00,
  sellingPrice: 3.99,
  image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '8',
  name: 'Avocados',
  quantity: 3,
  purchaseDate: createDate(-1),
  expirationDate: createDate(1),
  discount: 75,
  category: 'Fruits',
  isDonated: false,
  isWasted: false,
  buyingPrice: 1.50,
  sellingPrice: 2.99,
  image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '9',
  name: 'Spinach',
  quantity: 2,
  purchaseDate: createDate(-3),
  expirationDate: createDate(0),
  discount: 100,
  category: 'Vegetables',
  isDonated: false,
  isWasted: true,
  buyingPrice: 1.25,
  sellingPrice: 2.49,
  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '10',
  name: 'Orange Juice',
  quantity: 1,
  purchaseDate: createDate(-5),
  expirationDate: createDate(4),
  discount: 0,
  category: 'Beverages',
  isDonated: false,
  isWasted: false,
  buyingPrice: 3.00,
  sellingPrice: 4.99,
  image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '11',
  name: 'Ground Coffee',
  quantity: 1,
  purchaseDate: createDate(-10),
  expirationDate: createDate(20),
  discount: 0,
  category: 'Beverages',
  isDonated: false,
  isWasted: false,
  buyingPrice: 8.00,
  sellingPrice: 12.99,
  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '12',
  name: 'Salmon Fillet',
  quantity: 2,
  purchaseDate: createDate(-1),
  expirationDate: createDate(2),
  discount: 50,
  category: 'Seafood',
  isDonated: false,
  isWasted: false,
  buyingPrice: 8.00,
  sellingPrice: 12.99,
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '13',
  name: 'Mozzarella Cheese',
  quantity: 1,
  purchaseDate: createDate(-4),
  expirationDate: createDate(1),
  discount: 75,
  category: 'Dairy',
  isDonated: true,
  isWasted: false,
  buyingPrice: 3.50,
  sellingPrice: 5.99,
  image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}, {
  id: '14',
  name: 'Strawberries',
  quantity: 2,
  purchaseDate: createDate(-2),
  expirationDate: createDate(1),
  discount: 75,
  category: 'Fruits',
  isDonated: false,
  isWasted: false,
  buyingPrice: 2.50,
  sellingPrice: 3.99,
  image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
},
 {
  id: '15',
  name: 'Whole Grain Pasta',
  quantity: 3,
  purchaseDate: createDate(-15),
  expirationDate: createDate(45),
  discount: 0,
  category: 'Pantry',
  isDonated: false,
  isWasted: false,
  buyingPrice: 1.50,
  sellingPrice: 2.99,
  image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}
,
 {
  id: '16',
  name: 'Whole Grain Pasta',
  quantity: 3,
  purchaseDate: createDate(-15),
  expirationDate: createDate(-1),
  discount: 0,
  category: 'Bakery',
  isDonated: false,
  isWasted: true,
  buyingPrice: 1.50,
  sellingPrice: 2.99,
  image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
}
];

// Sample notifications data
const mockNotifications = exports.mockNotifications = [{
  id: '1',
  message: 'Yogurt has been marked for donation!',
  type: 'success',
  timestamp: createDate(0),
  isRead: false,
  productId: '5'
}, {
  id: '2',
  message: 'Tomatoes are expiring in 2 days.',
  type: 'warning',
  timestamp: createDate(0),
  isRead: false,
  productId: '2'
}, {
  id: '3',
  message: 'Bread is now at 75% discount!',
  type: 'info',
  timestamp: createDate(-1),
  isRead: true,
  productId: '3'
}, {
  id: '4',
  message: 'You have reduced food waste by 25% this month!',
  type: 'success',
  timestamp: createDate(-2),
  isRead: true
}];

// Sample donation records
const mockDonations = exports.mockDonations = [{
  id: '1',
  productId: '5',
  productName: 'Yogurt',
  quantity: 4,
  donationDate: createDate(0),
  organization: 'Local Food Bank'
}];

// Sample waste reduction data for charts
const mockWasteReduction = exports.mockWasteReduction = [{
  date: createDate(-30),
  reducedAmount: 2,
  donatedAmount: 1,
  wastedAmount: 3
}, {
  date: createDate(-25),
  reducedAmount: 3,
  donatedAmount: 2,
  wastedAmount: 2
}, {
  date: createDate(-20),
  reducedAmount: 4,
  donatedAmount: 3,
  wastedAmount: 2
}, {
  date: createDate(-15),
  reducedAmount: 5,
  donatedAmount: 4,
  wastedAmount: 1
}, {
  date: createDate(-10),
  reducedAmount: 6,
  donatedAmount: 5,
  wastedAmount: 1
}, {
  date: createDate(-5),
  reducedAmount: 7,
  donatedAmount: 6,
  wastedAmount: 0
}, {
  date: createDate(0),
  reducedAmount: 8,
  donatedAmount: 7,
  wastedAmount: 0
}];

// Chart data for the dashboard
const mockChartData = exports.mockChartData = {
  stockLevels: [{
    name: 'Dairy',
    value: 18
  }, {
    name: 'Vegetables',
    value: 6
  }, {
    name: 'Fruits',
    value: 9
  }, {
    name: 'Bakery',
    value: 1
  }, {
    name: 'Meat',
    value: 3
  }],
  wasteReduction: [{
    name: 'Jan',
    value: 10
  }, {
    name: 'Feb',
    value: 15
  }, {
    name: 'Mar',
    value: 12
  }, {
    name: 'Apr',
    value: 8
  }, {
    name: 'May',
    value: 5
  }, {
    name: 'Jun',
    value: 3
  }],
  donationVsWaste: [{
    name: 'Donated',
    value: 65
  }, {
    name: 'Wasted',
    value: 35
  }]
};

// Sample sell transactions data
const mockSellTransactions = exports.mockSellTransactions = [{
  id: '1',
  productId: '1',
  productName: 'Organic Milk',
  quantity: 1,
  price: 3.99,
  totalPrice: 3.99,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '555-0123',
  notes: 'Regular customer',
  sellDate: createDate(-1)
}, {
  id: '2',
  productId: '6',
  productName: 'Bananas',
  quantity: 2,
  price: 1.99,
  totalPrice: 3.98,
  customerName: 'Jane Smith',
  customerEmail: 'jane@example.com',
  customerPhone: '555-0124',
  notes: 'Bulk purchase',
  sellDate: createDate(-2)
}];