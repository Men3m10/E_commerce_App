const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} = require("../utils/validation/productValidation");

const {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  resizeProductImageCover,
  uploadProductImages,
} = require("../controllers/productController");

/////// nested route////////
const reviewRoute = require("./reviewRoutes");

Router.use("/:productId/reviews", reviewRoute);

/////////////////////////////////

Router.post(
  "/",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImageCover,
  createProductValidator,
  createProduct
);
Router.get("/", getProducts);
Router.get("/:id", getProductValidator, getProduct);
Router.put(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImageCover,
  updateProductValidator,
  updateProduct
);
Router.delete(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = Router;
