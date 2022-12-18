const express = require("express");

const Router = express.Router({ mergeParams: true });

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validation/reviewValidation");

const {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
  createFilterObject,
  setProductIdAndUserIdToBody,
} = require("../controllers/reviewController");

Router.post(
  "/",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("user"),
  setProductIdAndUserIdToBody,
  createReviewValidator,
  createReview
);
Router.get("/", createFilterObject, getReviews);
Router.get("/:id", getReviewValidator, getReview);
Router.put(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("user"),
  updateReviewValidator,
  updateReview
);
Router.delete(
  "/:id",
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager", "user"),
  deleteReviewValidator,
  deleteReview
);

module.exports = Router;
