const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const Factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

///////////////////////Models//////////////////////////
const Category = require("../models/categoryModel");

module.exports = {
  uploadCategoryImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${filename}`);
      //save image to our dataBase
      req.body.image = filename;
    }

    next();
  }),

  createCategory: Factory.createOne(Category),
  //@desc     create category
  //route     POST /api/v1/categories
  //access    private
  getCategories: Factory.getAll(Category),
  //@desc     get list of category
  //route     GET /api/v1/categories
  //access    public
  getCategory: Factory.getOnebyId(Category, "Category"),

  //@desc     get specific category by id
  //route     GET /api/v1/categories/:id
  //access    public
  updateCategory: Factory.updateOnebyId(Category, "Category"),

  //@desc    update specific category by id
  //route     PUT /api/v1/categories/:id
  //access    private
  deleteCategory: Factory.deleteOne(Category, "Category"),

  //@desc    delete specific category by id
  //route     DELETE /api/v1/categories/:id
  //access    private
};
