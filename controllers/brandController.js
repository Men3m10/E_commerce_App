const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const asyncHandler = require("express-async-handler");
const Factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Brand = require("../models/brandModel");

///////////////////////////////////////////////////////

module.exports = {
  uploadBrandImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/brands/${filename}`);
      //save image to our dataBase
      req.body.image = filename;
    }
    next();
  }),
  createBrand: Factory.createOne(Brand),
  //@desc     create brand
  //route     POST /api/v1/brands
  //access    private

  getBrands: Factory.getAll(Brand),
  //@desc     get list of brand
  //route     GET /api/v1/brands
  //access    public

  getBrand: Factory.getOnebyId(Brand, "Brand"),

  //@desc     get specific brand by id
  //route     GET /api/v1/brands/:id
  //access    public

  updateBrand: Factory.updateOnebyId(Brand, "Brand"),
  //@desc    update specific brand by id
  //route     PUT /api/v1/brands/:id
  //access    private

  deleteBrand: Factory.deleteOne(Brand, "Brand"),
  //@desc    delete specific brand by id
  //route     DELETE /api/v1/brands/:id
  //access    private
};
