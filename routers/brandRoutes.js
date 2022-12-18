const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} = require("../utils/validation/brandValidation");

const {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
  resizeImage,
  uploadBrandImage,
} = require("../controllers/brandController");

Router.post(
  "/",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrand
);
Router.get("/", getBrands);
Router.get("/:id", getBrandValidator, getBrand);
Router.put(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  updateBrand
);
Router.delete(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin"),
  deleteBrandValidator,
  deleteBrand
);

module.exports = Router;
