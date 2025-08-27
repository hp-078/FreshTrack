import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { getInventoryStats } from '../../utils/inventoryUtils';
import { ResponsiveContainer, BarChart, LineChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import { ShoppingBag, AlertTriangle, Gift, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockWasteReduction, mockChartData } from '../../data/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const { products, notifications } = useAppContext();
  const stats = getInventoryStats(products);

  // Colors for charts
  const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0', '#795548'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Format data for waste reduction line chart
  const wasteData = mockWasteReduction.map(item => ({
    date: item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Reduced: item.reducedAmount,
    Donated: item.donatedAmount,
    Wasted: item.wastedAmount
  }));

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <motion.div className="card" variants={itemVariants}>
          <div className="dashboard-stats">
            <div>
              <h3>{stats.totalItems}</h3>
              <p>Total Items</p>
            </div>
            <div className="rounded-full bg-primary-light p-3">
              <ShoppingBag className="dashboard-icon" color="var(--primary-dark-green)" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants}>
          <div className="dashboard-stats">
            <div>
              <h3>{stats.expiringItems}</h3>
              <p>Expiring Soon</p>
            </div>
            <div className="rounded-full bg-warning-light p-3">
              <AlertTriangle className="dashboard-icon" color="var(--warning-orange)" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants}>
          <div className="dashboard-stats">
            <div>
              <h3>{stats.totalDonations}</h3>
              <p>Donations</p>
            </div>
            <div className="rounded-full bg-success-light p-3">
              <Gift className="dashboard-icon" color="var(--success-green)" />
            </div>
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants}>
          <div className="dashboard-stats">
            <div>
              <h3>{stats.wasteReduction.toFixed(1)}%</h3>
              <p>Waste Reduction</p>
            </div>
            <div className="rounded-full bg-info-light p-3">
              <TrendingUp className="dashboard-icon" color="var(--info-blue)" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-charts-grid">
        <motion.div className="card" variants={itemVariants}>
          <h2>Stock Levels by Category</h2>
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={mockChartData.stockLevels}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Quantity" fill="var(--primary-green)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card" variants={itemVariants}>
          <h2>Waste Reduction Trend</h2>
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={wasteData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Reduced"
                  stroke="var(--primary-green)"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Donated" stroke="var(--info-blue)" />
                <Line type="monotone" dataKey="Wasted" stroke="var(--error-red)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div className="card dashboard-card" variants={itemVariants}>
        <div className="dashboard-card-header">
          <h2>Recent Notifications</h2>
        </div>
        <div className="dashboard-notification-list">
          {notifications.slice(0, 5).map(notification => (
            <div key={notification.id} className={`dashboard-notification-item notification-${notification.type}`}>
              <p className="dashboard-notification-message">{notification.message}</p>
              <span className="dashboard-notification-time">
                {notification.timestamp.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))}
          {notifications.length === 0 && <p>No notifications at this time.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;