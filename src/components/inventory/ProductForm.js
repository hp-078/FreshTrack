"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AppContext = require("../../contexts/AppContext");
var _lucideReact = require("lucide-react");
var _inventoryUtils = require("../../utils/inventoryUtils");
require("./ProductForm.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ProductForm = ({
  editProduct,
  onClose
}) => {
  const {
    addProduct,
    updateProduct
  } = (0, _AppContext.useAppContext)();
  const [formData, setFormData] = (0, _react.useState)({
    name: editProduct ? editProduct.name : '',
    quantity: editProduct ? editProduct.quantity : 1,
    category: editProduct ? editProduct.category : '',
    purchaseDate: editProduct && editProduct.purchaseDate 
      ? new Date(editProduct.purchaseDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    expirationDate: editProduct && editProduct.expirationDate 
      ? new Date(editProduct.expirationDate).toISOString().split('T')[0] 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    buyingPrice: editProduct ? editProduct.buyingPrice : 0,
    sellingPrice: editProduct ? editProduct.sellingPrice : 0,
    image: editProduct ? editProduct.image : '',
    isDonated: editProduct ? editProduct.isDonated : false,
    isWasted: editProduct ? editProduct.isWasted : false
  });

  // Prefill form when editing
  (0, _react.useEffect)(() => {
    if (editProduct) {
      setFormData({
        ...editProduct,
        purchaseDate: editProduct.purchaseDate ? new Date(editProduct.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expirationDate: editProduct.expirationDate ? new Date(editProduct.expirationDate).toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [editProduct]);

  // Calculate discount whenever expiration date changes
  (0, _react.useEffect)(() => {
    const daysUntilExpiration = (0, _inventoryUtils.getDaysUntilExpiration)(formData.expirationDate);
    const discount = (0, _inventoryUtils.calculateDiscount)(daysUntilExpiration);
    setFormData(prev => ({
      ...prev,
      discount
    }));
  }, [formData.expirationDate]);

  // Handle form input changes
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    const productData = {
      ...formData,
      purchaseDate: new Date(formData.purchaseDate),
      expirationDate: new Date(formData.expirationDate),
      quantity: parseInt(formData.quantity),
      buyingPrice: parseFloat(formData.buyingPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      isDonated: formData.isDonated,
      isWasted: formData.isWasted
    };
    if (editProduct) {
      updateProduct(editProduct._id, productData);
    } else {
      addProduct(productData);
    }
    onClose();
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-header"
  }, /*#__PURE__*/_react.default.createElement("h2", null, editProduct ? 'Edit Product' : 'Add New Product'), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn-icon",
    onClick: onClose,
    "aria-label": "Close form"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.X, {
    size: 20
  }))), /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-grid"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "name"
  }, "Product Name*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "name",
    name: "name",
    type: "text",
    className: "product-form-input",
    placeholder: "Enter product name",
    value: formData.name,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "category"
  }, "Category*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "category",
    name: "category",
    type: "text",
    className: "product-form-input",
    placeholder: "Enter category",
    value: formData.category,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "quantity"
  }, "Quantity*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "quantity",
    name: "quantity",
    type: "number",
    className: "product-form-input",
    min: "1",
    value: formData.quantity,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "purchaseDate"
  }, "Purchase Date*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "purchaseDate",
    name: "purchaseDate",
    type: "date",
    className: "product-form-input",
    value: formData.purchaseDate,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "expirationDate"
  }, "Expiration Date*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "expirationDate",
    name: "expirationDate",
    type: "date",
    className: "product-form-input",
    value: formData.expirationDate,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "buyingPrice"
  }, "Buying Price (₹)*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "buyingPrice",
    name: "buyingPrice",
    type: "number",
    className: "product-form-input",
    min: "0",
    step: "0.01",
    value: formData.buyingPrice,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "sellingPrice"
  }, "Selling Price (₹)*"), /*#__PURE__*/_react.default.createElement("input", {
    id: "sellingPrice",
    name: "sellingPrice",
    type: "number",
    className: "product-form-input",
    min: "0",
    step: "0.01",
    value: formData.sellingPrice,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "image"
  }, "Image URL"), /*#__PURE__*/_react.default.createElement("input", {
    id: "image",
    name: "image",
    type: "url",
    className: "product-form-input",
    placeholder: "Enter image URL",
    value: formData.image,
    onChange: handleChange
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-group"
  }, /*#__PURE__*/_react.default.createElement("label", {
    className: "product-form-label",
    htmlFor: "discount"
  } ))), /*#__PURE__*/_react.default.createElement("div", {
    className: "product-form-actions"
  }, /*#__PURE__*/_react.default.createElement("button", {
    type: "button",
    className: "product-form-button product-form-button-secondary",
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/_react.default.createElement("button", {
    type: "submit",
    className: "product-form-button product-form-button-primary"
  }, editProduct ? 'Update Product' : 'Add Product'))));
};
var _default = exports.default = ProductForm;