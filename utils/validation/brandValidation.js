const { check, body } = require("express-validator");
const slugify = require("slugify");
const validation = require("../../middlewares/validator");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required ")
    .trim()
    .isLength({ min: 3 })
    .withMessage("too short Brand name ")
    .isLength({ max: 30 })
    .withMessage("too long Brand name ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validation,
];

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validation,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validation,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validation,
];
