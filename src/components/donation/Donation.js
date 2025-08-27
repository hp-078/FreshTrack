"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AppContext = require("../../contexts/AppContext");
var _lucideReact = require("lucide-react");
var _framerMotion = require("framer-motion");
var _css = require("./Donation.css");
var _DonationForm = require("./DonationForm");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Donation = () => {
  const {
    donations,
    addDonation
  } = (0, _AppContext.useAppContext)();
  const [searchTerm, setSearchTerm] = (0, _react.useState)('');
  const [showDonationForm, setShowDonationForm] = (0, _react.useState)(false);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
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
        stiffness: 100
      }
    }
  };

  // Filter donations based on search term
  const filteredDonations = donations.filter(donation => donation.productName.toLowerCase().includes(searchTerm.toLowerCase()) || donation.organization?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate total donations
  const totalDonations = donations.reduce((acc, donation) => acc + donation.quantity, 0);

  // Group donations by month
  const donationsByMonth = donations.reduce((acc, donation) => {
    const month = donation.donationDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(donation);
    return acc;
  }, {});

  // Handle adding new donation
  const handleAddDonation = (donation) => {
    addDonation(donation);
  };

  return /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "donations",
    variants: containerVariants,
    initial: "hidden",
    animate: "visible"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-header"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Donations"), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setShowDonationForm(true)
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.PlusCircle, {
    size: 18
  }), " Add Donation")), /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, showDonationForm && /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "card donation-form-container",
    initial: {
      opacity: 0,
      height: 0
    },
    animate: {
      opacity: 1,
      height: "auto"
    },
    exit: {
      opacity: 0,
      height: 0
    },
    transition: {
      duration: 0.3
    }
  }, /*#__PURE__*/_react.default.createElement(_DonationForm.default, {
    onClose: () => setShowDonationForm(false),
    onAdd: handleAddDonation
  }))), /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "card",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-header"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h2", null, "Donation Summary"), /*#__PURE__*/_react.default.createElement("p", null, "Track all your food donations and their impact")), /*#__PURE__*/_react.default.createElement("div", {
    className: "rounded-full bg-success-light p-4"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.Gift, {
    size: 32,
    color: "var(--success-green)"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-summary"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-stats"
  }, /*#__PURE__*/_react.default.createElement("h3", null, donations.length), /*#__PURE__*/_react.default.createElement("p", null, "Total Donations")), /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-stats"
  }, /*#__PURE__*/_react.default.createElement("h3", null, totalDonations), /*#__PURE__*/_react.default.createElement("p", null, "Items Donated")), /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-stats"
  }, /*#__PURE__*/_react.default.createElement("h3", null, Object.keys(donationsByMonth).length), /*#__PURE__*/_react.default.createElement("p", null, "Active Months")))), /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "card",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Donation History"), filteredDonations.length === 0 ? /*#__PURE__*/_react.default.createElement("p", null, "No donations found. Items that are about to expire will be automatically marked for donation.") : /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-history"
  }, Object.entries(donationsByMonth).map(([month, monthDonations]) => /*#__PURE__*/_react.default.createElement("div", {
    key: month,
    className: "donations-month"
  }, /*#__PURE__*/_react.default.createElement("h3", {
    className: "donations-month-heading"
  }, month), /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "donations-grid",
    variants: containerVariants
  }, monthDonations.filter(donation => donation.productName.toLowerCase().includes(searchTerm.toLowerCase()) || donation.organization?.toLowerCase().includes(searchTerm.toLowerCase())).map(donation => /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    key: donation.id,
    className: "donation-card",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "donation-card-header"
  }, /*#__PURE__*/_react.default.createElement("h4", null, donation.productName), /*#__PURE__*/_react.default.createElement("span", {
    className: "donation-quantity"
  }, donation.quantity, " items")), /*#__PURE__*/_react.default.createElement("div", {
    className: "donation-details"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "donation-info"
  }, /*#__PURE__*/_react.default.createElement("strong", null, "Organization:"), " ", donation.organization), /*#__PURE__*/_react.default.createElement("div", {
    className: "donation-info"
  }, /*#__PURE__*/_react.default.createElement("strong", null, "Date:"), " ", donation.donationDate.toLocaleDateString())))))))), /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "card",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("h2", null, "How Donations Work"), /*#__PURE__*/_react.default.createElement("div", {
    className: "donations-process-grid"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step-number"
  }, "1"), /*#__PURE__*/_react.default.createElement("h3", null, "Expiration Tracking"), /*#__PURE__*/_react.default.createElement("p", null, "Products approaching their expiration date are automatically flagged in the system.")), /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step-number"
  }, "2"), /*#__PURE__*/_react.default.createElement("h3", null, "Automatic Discounting"), /*#__PURE__*/_react.default.createElement("p", null, "Products get increasingly discounted as they approach expiration to encourage use.")), /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step-number"
  }, "3"), /*#__PURE__*/_react.default.createElement("h3", null, "Donation Marking"), /*#__PURE__*/_react.default.createElement("p", null, "Items with 1 day remaining are automatically marked for donation to prevent waste.")), /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "process-step-number"
  }, "4"), /*#__PURE__*/_react.default.createElement("h3", null, "Impact Tracking"), /*#__PURE__*/_react.default.createElement("p", null, "All donations are recorded and tracked to measure your positive impact."))))));
};
var _default = exports.default = Donation;