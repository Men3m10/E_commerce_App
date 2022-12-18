const { check, body } = require("express-validator");
const slugify = require("slugify");
const validation = require("../../middlewares/validator");

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required ")
    .trim()
    .isLength({ min: 2 })
    .withMessage("too short category name ")
    .isLength({ max: 32 })
    .withMessage("too long category name ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category ID is required ")
    .isMongoId()
    .withMessage("invalid Category ID format"),
  validation,
];

exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validation,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validation,
];

exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subCategory id format"),
  validation,
];
