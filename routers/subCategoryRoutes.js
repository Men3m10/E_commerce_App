const express = require("express");

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

//mergeParams allow us to access parameters from other routes
//we need to access categoryId from category routes
const Router = express.Router({ mergeParams: true });

const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  deletesubCategoryValidator,
  updatesubCategoryValidator,
} = require("../utils/validation/subCategoryValidation");

const {
  createSubCategory,
  getsubCategories,
  getsubCategory,
  deletesubCategory,
  updatesubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../controllers/subCategoryCont");

Router.post(
  "/",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  setCategoryIdToBody,
  createsubCategoryValidator,
  createSubCategory
);
Router.get("/", createFilterObject, getsubCategories);
Router.get("/:id", getsubCategoryValidator, getsubCategory);
Router.put(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager"),
  updatesubCategoryValidator,
  updatesubCategory
);
Router.delete(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin"),
  deletesubCategoryValidator,
  deletesubCategory
);

module.exports = Router;
