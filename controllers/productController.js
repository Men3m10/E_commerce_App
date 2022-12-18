// const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

// const multer = require("multer");
// const ApiError = require("../utils/apiError");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

const Product = require("../models/productModel");
const Factory = require("./handlerFactory");
/////////////////////////////////////////////////////

module.exports = {
  uploadProductImages: uploadMixOfImages([
    {
      name: "imageCover",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]),

  resizeProductImageCover: asyncHandler(async (req, res, next) => {
    //console.log(req.files);
    //1- image Processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-Cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFilename}`);

      //save image to our dataBase
      req.body.imageCover = imageCoverFilename;
    }
    //2- image Processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          if (req.files) {
            await sharp(img.buffer)
              .resize(2000, 1333)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(`uploads/products/${imageName}`);
            //save image to our dataBase
            req.body.images.push(imageName);
          }
        })
      );
      next();
    }
  }),

  createProduct: Factory.createOne(Product),
  //@desc     create product
  //route     POST /api/v1/products
  //access    private

  getProducts: Factory.getAll(Product, "Product"),
  //@desc     get list of product
  //route     GET /api/v1/products
  //access    public

  getProduct: Factory.getOnebyId(Product, "Product", "reviews"),

  //@desc     get specific product by id
  //route     GET /api/v1/products/:id
  //access    public
  updateProduct: Factory.updateOnebyId(Product, "Product"),

  //@desc    update specific product by id
  //route     PUT /api/v1/products/:id
  //access    private

  deleteProduct: Factory.deleteOne(Product, "Product"),

  //@desc    delete specific product by id
  //route     DELETE /api/v1/products/:id
  //access    private
};
