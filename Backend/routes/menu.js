const express = require("express");

const router = express.Router ({mergeParams:true});
const {
    getAllMenus,
    getMenuForRestaurant,
    createMenu,
    deleteMenu,
    AddItemsToMenu,
    removeItemFromMenu,
    renameCategory,
    deleteCategory } = require("../controllers/menuController");

const { protect } = require("../controllers/authController");
const { authorizeRoles }= require("../middleware/authorizeRoles");

router.route("/").get(getAllMenus).post(protect,authorizeRoles("admin"),createMenu);
router.route("/restaurant/:storeId").get(getMenuForRestaurant);
router.route("/:menuId").delete(protect,authorizeRoles("admin"),deleteMenu);
router.route("/:menuId/items").post(protect,authorizeRoles("admin"),AddItemsToMenu);
router.route("/:menuId/items/:foodId").delete(protect,authorizeRoles("admin"),removeItemFromMenu);
router
    .route("/:menuId/categories/:categoryId")
    .patch(protect,authorizeRoles("admin"),renameCategory)
    .delete(protect,authorizeRoles("admin"),deleteCategory);

module.exports = router;


