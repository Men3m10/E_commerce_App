const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
      trim: true,
    },
    slug: {
      required: true,
      lowercase: true,
      type: String,
    },
    description: {
      type: String,
      minlength: [20, "too short product description"],
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "product price is required"],
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be bigger than or equal 1.0"],
      max: [5, "Rating must be smaller than or equal 5.0"],
    },
    ratingPersons: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //to enable virtuals populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual population
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

//mongoose middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.URL_BASE}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }

  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.URL_BASE}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};

//middleware get image url
//findOne  findAll Update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
//create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
