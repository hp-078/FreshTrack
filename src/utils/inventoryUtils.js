Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateProductDiscounts = exports.shouldDonate = exports.getDaysUntilExpiration = exports.getInventoryStats = exports.calculateDiscount = void 0;

/**
 * Calculate the remaining days until expiration
 */
const getDaysUntilExpiration = expirationDate => {
  const today = new Date();
  const expDate = new Date(expirationDate);

  // Reset time to compare just the dates
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculate the discount based on remaining days
 */
const calculateDiscount = expirationDate => {
  const remainingDays = getDaysUntilExpiration(expirationDate);
  if (remainingDays <= 0) return 100; // Expired
  if (remainingDays <= 1) return 75; // 1 day left
  if (remainingDays <= 3) return 50; // 2-3 days left
  if (remainingDays <= 5) return 25; // 4-5 days left
  return 0; // More than 5 days left
};

/**
 * Check if a product should be marked as donated
 */
const shouldDonate = product => {
  return getDaysUntilExpiration(product.expirationDate) <= 1 && !product.isDonated && !product.isWasted;
};

/**
 * Update product discounts based on expiration dates
 */
const updateProductDiscounts = products => {
  return products.map(product => {
    const daysUntilExpiration = getDaysUntilExpiration(product.expirationDate);
    const discount = calculateDiscount(product.expirationDate);
    
    // Only update discount if it's different from current discount
    if (discount !== product.discount) {
      return {
        ...product,
        discount,
        isDonated: daysUntilExpiration <= 1 && !product.isWasted
      };
    }
    return product;
  });
};

/**
 * Get statistics for inventory dashboard
 */
const getInventoryStats = products => {
  const totalItems = products.length;
  const expiringItems = products.filter(p => getDaysUntilExpiration(p.expirationDate) <= 3).length;
  const totalDonations = products.filter(p => p.isDonated).length;
  const wasteReduction = totalDonations / (totalItems || 1) * 100;
  return {
    totalItems,
    expiringItems,
    totalDonations,
    wasteReduction
  };
};

/**
 * Calculate profit margin for a product
 */
const calculateProfitMargin = product => {
  const discountedPrice = product.sellingPrice * (1 - (product.discount / 100));
  return ((discountedPrice - product.buyingPrice) / product.buyingPrice) * 100;
};

exports.getDaysUntilExpiration = getDaysUntilExpiration;
exports.calculateDiscount = calculateDiscount;
exports.shouldDonate = shouldDonate;
exports.updateProductDiscounts = updateProductDiscounts;
exports.getInventoryStats = getInventoryStats;
exports.calculateProfitMargin = calculateProfitMargin;