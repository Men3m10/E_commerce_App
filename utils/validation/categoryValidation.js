const { check, body } = require("express-validator");
const slugify = require("slugify");
const validation = require("../../middlewares/validator");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validation,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required ")
    .trim()
    .isLength({ min: 3 })
    .withMessage("too short category name ")
    .isLength({ max: 30 })
    .withMessage("too long category name ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validation,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validation,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validation,
];
