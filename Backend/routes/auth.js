const express = require("express");
const authController =require("../controllers/authController");
const router = express.Router();  //new router instance

router.post("/signup", authController.signup); //express calls signup function using authcontroller
router.post("/login",authController.login ); // express calls login function using authcontroller
router.get("/logout",authController.logout); // express calls logout function using authController
router.get("/me",authController.getUserProfile); // express calls getuser profile using authController

router.post("/forgetPassword",authController.forgotPassword);
router.patch("/resetPassword/:token",authController.resetPassword);
router.put(
    "/password/update",
    authController.protect,
    authController.updatePassword,
);

module.exports = router;