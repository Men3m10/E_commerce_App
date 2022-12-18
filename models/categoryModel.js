const mongoose = require("mongoose");
//1-schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required "],
      unique: [true, "name must be unique"],
      maxlength: [30, "too long category name"],
      minlength: [3, "too short category name"],
    },
    //A and B ==> shopping/a-and-b
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
    const imageUrl = `${process.env.URL_BASE}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

//middleware get image url
//findOne  findAll Update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});
//create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//2-model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
