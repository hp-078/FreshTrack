"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AppContext = require("../../contexts/AppContext");
var _inventoryUtils = require("../../utils/inventoryUtils");
var _lucideReact = require("lucide-react");
var _framerMotion = require("framer-motion");
var _ProductForm = _interopRequireDefault(require("./ProductForm"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Inventory = () => {
  const {
    products,
    updateProduct,
    deleteProduct
  } = (0, _AppContext.useAppContext)();
  const [searchTerm, setSearchTerm] = (0, _react.useState)('');
  const [sortConfig, setSortConfig] = (0, _react.useState)({
    key: '',
    direction: 'ascending'
  });
  const [filterCategory, setFilterCategory] = (0, _react.useState)('');
  const [filterStatus, setFilterStatus] = (0, _react.useState)('');
  const [showAddForm, setShowAddForm] = (0, _react.useState)(false);
  const [editingProduct, setEditingProduct] = (0, _react.useState)(null);

  // Get all unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Handle search and filtering
  const filteredProducts = products.filter(product => {
    // Search term filter
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const categoryMatch = filterCategory ? product.category === filterCategory : true;

    // Status filter
    const statusMatch = filterStatus ? (
      filterStatus === 'donated' ? product.isDonated :
      filterStatus === 'wasted' ? product.isWasted :
      filterStatus === 'expired' ? (0, _inventoryUtils.getDaysUntilExpiration)(product.expirationDate) <= 0 :
      filterStatus === 'expiring_soon' ? (0, _inventoryUtils.getDaysUntilExpiration)(product.expirationDate) <= 3 && (0, _inventoryUtils.getDaysUntilExpiration)(product.expirationDate) > 0 :
      filterStatus === 'good' ? (0, _inventoryUtils.getDaysUntilExpiration)(product.expirationDate) > 3 && !product.isDonated && !product.isWasted :
      true
    ) : true;

    return searchMatch && categoryMatch && statusMatch;
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
  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({
      key,
      direction
    });
  };

  // Get the sort direction indicator
  const getSortDirectionIndicator = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? /*#__PURE__*/_react.default.createElement(_lucideReact.ArrowUp, {
      size: 16,
      className: "inline-block ml-1"
    }) : /*#__PURE__*/_react.default.createElement(_lucideReact.ArrowDown, {
      size: 16,
      className: "inline-block ml-1"
    });
  };

  // Handle edit button click
  const handleEdit = product => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  // Handle product deletion
  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Mark product as wasted
  const handleMarkAsWasted = async (id) => {
    if (window.confirm('Are you sure you want to mark this product as wasted?')) {
      try {
        // Find the product in the current products list
        const product = products.find(p => p._id === id);
        if (!product) {
          throw new Error('Product not found');
        }

        // Update the product with all existing data plus wasted status
        await updateProduct(id, {
          ...product,
          isWasted: true,
          isDonated: false,
          quantity: 0,
          discount: 100,
          name: product.name,
          category: product.category,
          purchaseDate: product.purchaseDate,
          expirationDate: product.expirationDate,
          buyingPrice: product.buyingPrice,
          sellingPrice: product.sellingPrice,
          image: product.image
        });
      } catch (error) {
        alert('Failed to mark product as wasted. Please try again.');
        console.error('Mark as wasted error:', error);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2
      }
    }
  };

  // Get badge class for expiration status
  const getExpirationBadge = expirationDate => {
    if (!expirationDate) return null;
    const daysRemaining = (0, _inventoryUtils.getDaysUntilExpiration)(expirationDate);
    if (daysRemaining <= 0) {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "badge badge-error"
      }, "Expired");
    } else if (daysRemaining <= 3) {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "badge badge-warning"
      }, "Expiring Soon");
    } else {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "badge badge-success"
      }, "Good");
    }
  };

  // Get badge for discount
  const getDiscountBadge = discount => {
    if (discount <= 0) return null;
    return /*#__PURE__*/_react.default.createElement("span", {
      className: "badge badge-info"
    }, discount, "% OFF");
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStatus('');
    setSortConfig({
      key: '',
      direction: 'ascending'
    });
  };

  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return 'normal';
    const daysRemaining = (0, _inventoryUtils.getDaysUntilExpiration)(expirationDate);
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 1) return 'critical';
    if (daysRemaining <= 3) return 'warning';
    return 'normal';
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "inventory"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Inventory Management"), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setEditingProduct(null);
      setShowAddForm(true);
    }
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.PlusCircle, {
    size: 18
  }), "Add Product")), /*#__PURE__*/_react.default.createElement("div", {
    className: "card"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--spacing-md)'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "form-label",
    htmlFor: "search"
  }, "Search Products"), /*#__PURE__*/_react.default.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/_react.default.createElement("input", {
    id: "search",
    type: "text",
    className: "form-input",
    placeholder: "Search by name or category",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value)
  }), /*#__PURE__*/_react.default.createElement(_lucideReact.Search, {
    size: 18,
    className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "form-label",
    htmlFor: "category"
  }, "Filter by Category"), /*#__PURE__*/_react.default.createElement("select", {
    id: "category",
    className: "form-input",
    value: filterCategory,
    onChange: e => setFilterCategory(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: ""
  }, "All Categories"), categories.map(category => /*#__PURE__*/_react.default.createElement("option", {
    key: category,
    value: category
  }, category)))), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "form-label",
    htmlFor: "status"
  }, "Filter by Status"), /*#__PURE__*/_react.default.createElement("select", {
    id: "status",
    className: "form-input",
    value: filterStatus,
    onChange: e => setFilterStatus(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("option", {
    value: ""
  }, "All Status"), /*#__PURE__*/_react.default.createElement("option", {
    value: "good"
  }, "Good"), /*#__PURE__*/_react.default.createElement("option", {
    value: "expired"
  }, "Expired"), /*#__PURE__*/_react.default.createElement("option", {
    value: "expiring_soon"
  }, "Expiring Soon"), /*#__PURE__*/_react.default.createElement("option", {
    value: "donated"
  }, "Donated"), /*#__PURE__*/_react.default.createElement("option", {
    value: "wasted"
  }, "Wasted"))), /*#__PURE__*/_react.default.createElement("div", {
    className: "form-group",
    style: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "btn btn-secondary",
    onClick: resetFilters,
    style: {
      height: '38px'
    }
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.RefreshCw, {
    size: 16
  }), "Reset Filters")))), /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, showAddForm && /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "card",
    initial: {
      opacity: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  }, /*#__PURE__*/_react.default.createElement(_ProductForm.default, {
    editProduct: editingProduct,
    onClose: () => setShowAddForm(false)
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "card"
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Product List ", filteredProducts.length > 0 && `(${filteredProducts.length})`), filteredProducts.length === 0 ? /*#__PURE__*/_react.default.createElement("p", null, "No products found. Add some products or adjust your filters.") : /*#__PURE__*/_react.default.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/_react.default.createElement("table", {
    className: "table"
  }, /*#__PURE__*/_react.default.createElement("thead", null, /*#__PURE__*/_react.default.createElement("tr", null, /*#__PURE__*/_react.default.createElement("th", {
    onClick: () => requestSort('name'),
    style: {
      cursor: 'pointer'
    }
  }, "Name ", getSortDirectionIndicator('name')), /*#__PURE__*/_react.default.createElement("th", {
    onClick: () => requestSort('category'),
    style: {
      cursor: 'pointer'
    }
  }, "Category ", getSortDirectionIndicator('category')), /*#__PURE__*/_react.default.createElement("th", {
    onClick: () => requestSort('quantity'),
    style: {
      cursor: 'pointer'
    }
  }, "Quantity ", getSortDirectionIndicator('quantity')), /*#__PURE__*/_react.default.createElement("th", {
    onClick: () => requestSort('purchaseDate'),
    style: {
      cursor: 'pointer'
    }
  }, "Purchase Date ", getSortDirectionIndicator('purchaseDate')), /*#__PURE__*/_react.default.createElement("th", {
    onClick: () => requestSort('expirationDate'),
    style: {
      cursor: 'pointer'
    }
  }, "Expiration Date ", getSortDirectionIndicator('expirationDate')), /*#__PURE__*/_react.default.createElement("th", null, "Status"), /*#__PURE__*/_react.default.createElement("th", null, "Actions"))), /*#__PURE__*/_react.default.createElement(_framerMotion.motion.tbody, {
    variants: containerVariants,
    initial: "hidden",
    animate: "visible"
  }, /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, sortedProducts.map(product => /*#__PURE__*/_react.default.createElement(_framerMotion.motion.tr, {
    key: product.id,
    variants: itemVariants,
    exit: "exit",
    className: product.isDonated ? 'donated-row' : product.isWasted ? 'wasted-row' : ''
  }, /*#__PURE__*/_react.default.createElement("td", {
    className: "flex items-center gap-sm"
  }, product.image && /*#__PURE__*/_react.default.createElement("img", {
    src: product.image,
    alt: product.name,
    className: "product-image",
    style: {
      width: '40px',
      height: '40px',
      borderRadius: 'var(--border-radius)',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, product.name), /*#__PURE__*/_react.default.createElement("div", null, getDiscountBadge(product.discount)))), /*#__PURE__*/_react.default.createElement("td", null, product.category), /*#__PURE__*/_react.default.createElement("td", null, product.quantity), /*#__PURE__*/_react.default.createElement("td", null, product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : 'N/A'), /*#__PURE__*/_react.default.createElement("td", null, product.expirationDate ? new Date(product.expirationDate).toLocaleDateString() : 'N/A'), /*#__PURE__*/_react.default.createElement("td", null, product.isDonated ? /*#__PURE__*/_react.default.createElement("span", {
    className: "badge badge-success"
  }, "Donated") : product.isWasted ? /*#__PURE__*/_react.default.createElement("span", {
    className: "badge badge-error"
  }, "Wasted") : getExpirationBadge(product.expirationDate)), /*#__PURE__*/_react.default.createElement("td", null, !product.isDonated && !product.isWasted && /*#__PURE__*/_react.default.createElement("div", {
    className: "flex gap-sm"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "btn-icon",
    onClick: () => handleEdit(product),
    "aria-label": "Edit product"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.Edit, {
    size: 16
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn-icon",
    onClick: () => handleDelete(product._id),
    "aria-label": "Delete product"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.Trash2, {
    size: 16
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn-icon",
    onClick: () => handleMarkAsWasted(product._id),
    "aria-label": "Mark as wasted"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.XCircle, {
    size: 16
  }))))))))))));
};
var _default = exports.default = Inventory;