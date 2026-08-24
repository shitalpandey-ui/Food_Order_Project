//msin configuration file that creates your application, loads middleware, and registers routes

// import express
const express = require("express");

// create express application
const app = express();
// import middleware packages

const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const cartROutes = require("./routes/cart");
const foodItemRoutes = require("./routes/foodItem");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");
const restaurantRoutes = require("./routes/restaurant");
const errorMiddleware = require("./middleware/errors");
// user middleware

app.use(cors({
  origin: 'http://localhost:3001', // your frontend's URL
  credentials: true // only needed if you're sending cookies/auth headers
}));
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

app.use("/api/user", authRoutes);
app.use("/api/cart", cartROutes);
app.use("/api/fooditems", foodItemRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.use(errorMiddleware);

module.exports = app;
