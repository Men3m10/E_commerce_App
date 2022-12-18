const { check } = require("express-validator");

const validation = require("../../middlewares/validator");
const Coupon = require("../../models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required ")
    .trim()
    .toUpperCase()
    .custom((couponName, { req }) =>
      Coupon.findOne({ name: couponName }).then((coupon) => {
        if (coupon) {
          return Promise.reject(
            new Error("Coupon with this name already existed")
          );
        }
      })
    ),
  check("expiredDate")
    .notEmpty()
    .withMessage("Coupon expiredDate is required "),
  check("discount").notEmpty().withMessage("Coupon discount is required "),
  validation,
];

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id format"),
  validation,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id format"),
  validation,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("invalid Coupon id format"),
  validation,
];
