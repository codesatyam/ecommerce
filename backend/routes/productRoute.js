const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProducts,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, updateProducts)
  .delete(isAuthenticatedUser,  deleteProducts)
  .get(getProductDetails);

  router.route("/product/:id").get(getProductDetails);

module.exports = router;
