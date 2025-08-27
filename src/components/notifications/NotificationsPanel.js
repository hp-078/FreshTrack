"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _AppContext = require("../../contexts/AppContext");
var _lucideReact = require("lucide-react");
var _framerMotion = require("framer-motion");
var _css = require("./NotificationsPanel.css");

const NotificationsPanel = () => {
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications
  } = (0, _AppContext.useAppContext)();

  // Get icon based on notification type
  const getNotificationIcon = type => {
    switch (type) {
      case 'success':
        return /*#__PURE__*/_react.default.createElement(_lucideReact.CheckCircle, {
          size: 20,
          className: "notification-icon success"
        });
      case 'warning':
        return /*#__PURE__*/_react.default.createElement(_lucideReact.AlertTriangle, {
          size: 20,
          className: "notification-icon warning"
        });
      case 'error':
        return /*#__PURE__*/_react.default.createElement(_lucideReact.AlertCircle, {
          size: 20,
          className: "notification-icon error"
        });
      case 'info':
      default:
        return /*#__PURE__*/_react.default.createElement(_lucideReact.Info, {
          size: 20,
          className: "notification-icon info"
        });
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
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2
      }
    }
  };

  // Group notifications by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isToday = date => {
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  const isYesterday = date => {
    return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
  };
  const groupedNotifications = {
    today: notifications.filter(n => isToday(n.timestamp)),
    yesterday: notifications.filter(n => isYesterday(n.timestamp)),
    older: notifications.filter(n => !isToday(n.timestamp) && !isYesterday(n.timestamp))
  };
  return /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "notifications-panel",
    variants: containerVariants,
    initial: "hidden",
    animate: "visible"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "notifications-header"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Notifications"), /*#__PURE__*/_react.default.createElement("button", {
    className: "btn btn-secondary",
    onClick: clearAllNotifications,
    disabled: notifications.length === 0
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.Trash2, {
    size: 16
  }), "Clear All")), notifications.length === 0 ? /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "notifications-empty-state",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement(_lucideReact.Bell, {
    size: 64,
    className: "icon"
  }), /*#__PURE__*/_react.default.createElement("h3", null, "No Notifications"), /*#__PURE__*/_react.default.createElement("p", null, "You're all caught up! There are no notifications at this time.")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, groupedNotifications.today.length > 0 && /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "notifications-section",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Today"), /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, groupedNotifications.today.map(notification => /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    key: notification.id,
    className: `notification ${notification.type} ${notification.isRead ? 'read' : 'unread'}`,
    variants: itemVariants,
    exit: "exit",
    onClick: () => markNotificationAsRead(notification.id)
  }, getNotificationIcon(notification.type), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-content"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-meta"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-time"
  }, notification.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })), !notification.isRead && /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-status"
  }, "New"))))))), groupedNotifications.yesterday.length > 0 && /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "notifications-section",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Yesterday"), /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, groupedNotifications.yesterday.map(notification => /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    key: notification.id,
    className: `notification ${notification.type} ${notification.isRead ? 'read' : 'unread'}`,
    variants: itemVariants,
    exit: "exit",
    onClick: () => markNotificationAsRead(notification.id)
  }, getNotificationIcon(notification.type), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-content"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-meta"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-time"
  }, notification.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })), !notification.isRead && /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-status"
  }, "New"))))))), groupedNotifications.older.length > 0 && /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    className: "notifications-section",
    variants: itemVariants
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Earlier"), /*#__PURE__*/_react.default.createElement(_framerMotion.AnimatePresence, null, groupedNotifications.older.map(notification => /*#__PURE__*/_react.default.createElement(_framerMotion.motion.div, {
    key: notification.id,
    className: `notification ${notification.type} ${notification.isRead ? 'read' : 'unread'}`,
    variants: itemVariants,
    exit: "exit",
    onClick: () => markNotificationAsRead(notification.id)
  }, getNotificationIcon(notification.type), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-content"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "notification-message"
  }, notification.message), /*#__PURE__*/_react.default.createElement("div", {
    className: "notification-meta"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-time"
  }, notification.timestamp.toLocaleDateString(), " ", notification.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })), !notification.isRead && /*#__PURE__*/_react.default.createElement("span", {
    className: "notification-status"
  }, "New")))))))));
};
var _default = exports.default = NotificationsPanel;