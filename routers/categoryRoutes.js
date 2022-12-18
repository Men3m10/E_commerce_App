const express = require("express");

const Router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validation/categoryValidation");

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/categoryCont");

///////////////////////////mergeParams///////////////////////////
const subCategortRoutes = require("./subCategoryRoutes");

Router.use("/:categoryId/subcategories", subCategortRoutes);

///////////////////////////////////////////////////////////////

Router.post(
  "/",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  createCategoryValidator,
  createCategory
);
Router.get("/", getCategories);
Router.get("/:id", getCategoryValidator, getCategory);
Router.put(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  updateCategoryValidator,
  updateCategory
);
Router.delete(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin"),
  deleteCategoryValidator,
  deleteCategory
);

module.exports = Router;
