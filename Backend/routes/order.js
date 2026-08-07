const express = require("express");
const router = express.Router();

const {getSingleOredr, myOrders, allOrders} = require("../controllers//orderContoller");
const authController  = require("../middleware/authController");

router.route("/:id").get(authController.protect, getSingleOrder);
router.route("/me/myOrders").get(authController.protect, myOrders);

module.exports = router;



