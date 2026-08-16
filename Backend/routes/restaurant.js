const express = require("express");
const restaurantController =require("../controllers/restaurantController");
const router = express.Router({ mergeParams: true}); 

const { product } = require("../controllers/restaurantController");
const{ authorizeRoles } = require("../middleware/authorizeRoles");

