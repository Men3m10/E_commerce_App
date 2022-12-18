const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name is required"],
      unique: [true, "coupon name is unique"],
    },
    expiredDate: {
      //mm/dd/yy
      //03/25/2022  -->25-3-2022
      type: Date,
      required: [true, "expired date is required"],
    },
    discount: {
      type: Number,
      required: [true, "discount number is required"],
    },
    numberOfuse: {
      type: Number,
      required: [true, " number of use is required"],
    },
  },
  { timestamps: true }
);

const couponModel = mongoose.model("Coupon", couponSchema);

module.exports = couponModel;
