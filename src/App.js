"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _AppContext = require("./contexts/AppContext");
var _reactRouterDom = require("react-router-dom");
var _lucideReact = require("lucide-react");
require("./styles/global.css");
require("./App.css");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// Placeholder for components (will create them later)
const Dashboard = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./components/dashboard/Dashboard'))));
const Inventory = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./components/inventory/Inventory'))));
const Donation = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./components/donation/Donation'))));
const Notifications = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./components/notifications/NotificationsPanel'))));
const Sell = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./components/sell/Sell'))));

// Layout component
const Layout = ({
  children
}) => {
  const {
    darkMode,
    toggleDarkMode,
    notifications
  } = (0, _AppContext.useAppContext)();
  const [mobileMenuOpen, setMobileMenuOpen] = _react.default.useState(false);

  // Apply dark mode to body
  (0, _react.useEffect)(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: `app-container ${darkMode ? 'dark-mode' : ''}`
  }, /*#__PURE__*/_react.default.createElement("header", {
    className: "app-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "header-content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "logo"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/"
  }, "FreshTrack")), /*#__PURE__*/_react.default.createElement("button", {
    className: "mobile-menu-button",
    onClick: () => setMobileMenuOpen(!mobileMenuOpen)
  }, mobileMenuOpen ? /*#__PURE__*/_react.default.createElement(_lucideReact.X, null) : /*#__PURE__*/_react.default.createElement(_lucideReact.Menu, null)), /*#__PURE__*/_react.default.createElement("nav", {
    className: `main-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`
  }, /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Link, {
    to: "/"
  }, "Dashboard")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: "/inventory"
  }, "Inventory")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: "/donations"
  }, "Donations")), /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: "/sell"
  }, "Sell")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "header-actions"
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: "/notifications",
    className: "notification-icon"
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.BellRing, null), unreadNotifications > 0 && /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-badge"
  }, unreadNotifications)), /*#__PURE__*/_react.default.createElement("button", {
    className: "theme-toggle",
    onClick: toggleDarkMode
  }, darkMode ? /*#__PURE__*/_react.default.createElement(_lucideReact.Sun, null) : /*#__PURE__*/_react.default.createElement(_lucideReact.Moon, null)))))), /*#__PURE__*/_react.default.createElement("main", {
    className: "app-main"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react.default.createElement(_react.default.Suspense, {
    fallback: /*#__PURE__*/_react.default.createElement("div", {
      className: "loading"
    }, "Loading...")
  }, children))), /*#__PURE__*/_react.default.createElement("footer", {
    className: "app-footer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "footer-content"
  }, /*#__PURE__*/_react.default.createElement("p", null, "\xA9 ", new Date().getFullYear(), " FreshTrack. All rights reserved."), /*#__PURE__*/_react.default.createElement("p", null, "Making the world better by reducing food waste.")))));
};
function App() {
  return /*#__PURE__*/_react.default.createElement(_AppContext.AppProvider, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(Layout, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Routes, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/",
    element: /*#__PURE__*/_react.default.createElement(Dashboard, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/inventory",
    element: /*#__PURE__*/_react.default.createElement(Inventory, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/donations",
    element: /*#__PURE__*/_react.default.createElement(Donation, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/notifications",
    element: /*#__PURE__*/_react.default.createElement(Notifications, null)
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, {
    path: "/sell",
    element: /*#__PURE__*/_react.default.createElement(Sell, null)
  })))));
}
var _default = exports.default = App;