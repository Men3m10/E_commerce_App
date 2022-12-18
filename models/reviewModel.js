const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "min ratings value is 1.0"],
      max: [5, "max ratings value is 5.0"],
      required: [true, "Review ratings is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    //parent refrence
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
  this.populate({ path: "user", select: "name" });
});
///////////////////AGGREGATION///////////////////////////////////////////////////////
reviewSchema.statics.calcAverageRatingAndQuantaty = async function (productId) {
  const result = await this.aggregate([
    //stage 1 - get all reviews in specific product
    {
      $match: { product: productId },
    },
    //stage 2 - grouping reviews based on product id and calc avg, quantaty
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingQuantaty: { $sum: 1 },
      },
    },
  ]);
  //console.log(result);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingPersons: result[0].ratingQuantaty,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingPersons: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingAndQuantaty(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingAndQuantaty(this.product);
});

///////////////////////////////////////////////////////////////////////////////////////
const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
