const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createCouponValidator,
  deleteCouponValidator,
  getCouponValidator,
  updateCouponValidator,
} = require("../utils/validation/couponValidation");

const {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} = require("../controllers/couponController");

Router.use(
  auth.Protect,
  check.checkActiveUser,
  auth.allowedTo("admin", "manager")
);

Router.post("/", createCouponValidator, createCoupon);
Router.get("/", getCoupons);
Router.get("/:id", getCouponValidator, getCoupon);
Router.put("/:id", updateCouponValidator, updateCoupon);
Router.delete("/:id", deleteCouponValidator, deleteCoupon);

module.exports = Router;
