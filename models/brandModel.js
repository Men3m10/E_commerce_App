const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      maxlength: [32, "too long brand name"],
      minlength: [3, "too short brand name"],
      unique: [true, "brand name must be unique"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.URL_BASE}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

//middleware get image url
//findOne  findAll Update
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
//create
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

const brandModel = mongoose.model("Brand", brandSchema);
module.exports = brandModel;
