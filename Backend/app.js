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
const foodItemRoutes = require("./routes/fooditem");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");
const restaurantRoutes = require("./routes/restaurant");
// user middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", authRoutes);
app.use("/api/cart", cartROutes);
app.use("/api/fooditems", foodItemRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);

module.exports = app;
