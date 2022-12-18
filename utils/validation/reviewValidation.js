const { check } = require("express-validator");
const validation = require("../../middlewares/validator");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Review ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be betweewn 1 to 5"),
  check("user")
    .notEmpty()
    .withMessage("Review must be belong to user")
    .isMongoId()
    .withMessage("invalid Review id format"),
  check("product")
    .notEmpty()
    .withMessage("Review must be belong to product")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((value, { req }) =>
      //check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
  validation,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id format"),
  validation,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((value, { req }) =>
      //check review owner before update
      Review.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`there is no review with this id`));
        }
        //console.log(review.user !== req.user._id);

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you are not allowed to update review of another user")
          );
        }
      })
    ),
  validation,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((value, { req }) => {
      //check review owner before update

      if (req.user.role == "user") {
        return Review.findById(value).then((review) => {
          if (!review) {
            return Promise.reject(new Error(`there is no review with this id`));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("you are not allowed to Delete review of another user")
            );
          }
        });
      }
      return true;
    }),
  validation,
];
