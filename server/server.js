const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/freshtrack";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Import routes
const inventoryRoutes = require("./routes/inventory");
const soldItemsRoutes = require("./routes/soldItems");
const donatedItemsRoutes = require("./routes/donatedItems");

// Use routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sold-items", soldItemsRoutes);
app.use("/api/donated-items", donatedItemsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
