"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAppContext = exports.AppProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
var _inventoryUtils = require("../utils/inventoryUtils");
var _mockData = require("../data/mockData");
var _api = require("../services/api");

function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }

const AppContext = /*#__PURE__*/(0, _react.createContext)(undefined);

const initialState = {
  products: [],
  notifications: _mockData.mockNotifications || [],
  donations: _mockData.mockDonations || [],
  sellTransactions: [],
  darkMode: false,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload || [] };
    case 'SET_SELL_TRANSACTIONS':
      return { ...state, sellTransactions: action.payload || [] };
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        products: [...(state.products || []), action.payload]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: (state.products || []).map(product =>
          product._id === action.payload._id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: (state.products || []).filter(product => product._id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_DONATION':
      return { ...state, donations: [...(state.donations || []), action.payload] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...(state.notifications || [])] };
    case 'MARK_NOTIFICATION_AS_READ':
      return {
        ...state,
        notifications: (state.notifications || []).map(notification =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        )
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'ADD_SELL_TRANSACTION':
      return { 
        ...state, 
        sellTransactions: [action.payload, ...(state.sellTransactions || [])],
        products: state.products.map(product =>
          product._id === action.payload.inventoryItemId
            ? { 
                ...product, 
                quantity: product.quantity - action.payload.quantity,
                isWasted: product.quantity - action.payload.quantity <= 0 ? true : product.isWasted,
                discount: product.quantity - action.payload.quantity <= 0 ? 100 : product.discount
              }
            : product
        )
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

const AppProvider = ({ children }) => {
  const [state, dispatch] = (0, _react.useReducer)(appReducer, initialState);

  // Fetch products and sold items on component mount
  (0, _react.useEffect)(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const [products, soldItems] = await Promise.all([
          _api.inventoryApi.getAllItems(),
          _api.soldItemsApi.getAllItems()
        ]);
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        dispatch({ type: 'SET_SELL_TRANSACTIONS', payload: soldItems });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, []);

  // Update product discounts based on expiration dates
  (0, _react.useEffect)(() => {
    // Skip if no products or empty array
    if (!state.products || state.products.length === 0) return;
    
    // Calculate updated products
    const updatedProducts = (0, _inventoryUtils.updateProductDiscounts)(state.products);
    
    // Only dispatch if there are actual changes to prevent infinite loops
    const hasChanges = JSON.stringify(updatedProducts) !== JSON.stringify(state.products);
    
    if (hasChanges) {
      dispatch({ type: 'SET_PRODUCTS', payload: updatedProducts });
    }
  }, [state.products]);

  const addProduct = async (productData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProduct = await _api.inventoryApi.addItem(productData);
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      return newProduct;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProduct = await _api.inventoryApi.updateItem(id, updates);
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      return updatedProduct;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await _api.inventoryApi.deleteItem(id);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addDonation = (donation) => {
    dispatch({ type: 'ADD_DONATION', payload: donation });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationAsRead = (id) => {
    dispatch({ type: 'MARK_NOTIFICATION_AS_READ', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const addSellTransaction = async (transaction) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validate required fields before sending to API
      const requiredFields = ['inventoryItemId', 'quantity', 'totalPrice', 'sellDate'];
      const missingFields = requiredFields.filter(field => !transaction[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Validate that quantity is positive
      if (transaction.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
      
      // Find the product to validate quantity
      const product = state.products.find(p => p._id === transaction.inventoryItemId);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (transaction.quantity > product.quantity) {
        throw new Error(`Cannot sell more than available quantity (${product.quantity})`);
      }
      
      // Process the transaction
      const newTransaction = await _api.soldItemsApi.addItem(transaction);
      
      // Update local state
      dispatch({ 
        type: 'ADD_SELL_TRANSACTION', 
        payload: newTransaction 
      });
      
      return newTransaction;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const value = {
    ...state,
    addProduct,
    updateProduct,
    deleteProduct,
    addDonation,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    addSellTransaction,
    toggleDarkMode
  };

  return /*#__PURE__*/_react.default.createElement(AppContext.Provider, {
    value: value
  }, children);
};

exports.AppProvider = AppProvider;

const useAppContext = () => {
  const context = (0, _react.useContext)(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

exports.useAppContext = useAppContext;