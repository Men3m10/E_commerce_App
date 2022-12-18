const { check, body } = require("express-validator");
const slugify = require("slugify");
const validation = require("../../middlewares/validator");

const Category = require("../../models/categoryModel");
const subCategory = require("../../models/subCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validation,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required ")
    .trim()
    .isLength({ min: 3 })
    .withMessage("too short Product name ")
    .isLength({ max: 100 })
    .withMessage("too long Product name ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description name is required ")
    .isLength({ min: 20 })
    .withMessage("too short description ")
    .isLength({ max: 2000 })
    .withMessage("too long description "),
  check("quantity")
    .notEmpty()
    .withMessage("quantity is required ")
    .isNumeric()
    .withMessage("quantity must be a Number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage(" sold quantity must be a Number"),
  check("price")
    .isNumeric()
    .withMessage("Price must be a Number")
    .notEmpty()
    .withMessage("Price is required ")
    .isLength({ max: 10 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .isNumeric()
    .withMessage("Discount Price must be a Number")
    .toFloat()
    .optional()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(" priceAfterDiscount must be lower than price");
      }

      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of strings"),
  check("imageCover").notEmpty().withMessage("product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be an array of strings"),
  check("category")
    .isMongoId()
    .withMessage("invalid category id format")
    .notEmpty()
    .withMessage("product must be belong to category")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcategory")
    .isMongoId()
    .withMessage("invalid subcategory id format")
    .optional()
    .custom((subCategoryIds) =>
      subCategory
        .find({ _id: { $exists: true, $in: subCategoryIds } })
        .then((result) => {
          if (result.length < 1 || result.length !== subCategoryIds.length) {
            return Promise.reject(new Error(`No subCategory for this ids`));
          }
        })
    )
    .custom((val, { req }) =>
      subCategory.find({ category: req.body.category }).then((categories) => {
        const subCategoriesInDB = [];
        categories.forEach((category) => {
          subCategoriesInDB.push(category._id.toString());
        });
        const checker = val.every((v) => subCategoriesInDB.includes(v));
        if (!checker) {
          return Promise.reject(
            new Error(`subCategories is not belong to this category`)
          );
        }
      })
    ),
  check("brand").isMongoId().withMessage("invalid brand id format").optional(),
  check("ratingAverage")
    .isNumeric()
    .withMessage("Rating average must be a Number")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Rating must be bigger than or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be smaller than or equal 5.0"),
  check("ratingPersons")
    .optional()
    .isNumeric()
    .withMessage("ratingPersons must be a Number"),
  validation,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validation,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid Brand id format"),
  validation,
];
