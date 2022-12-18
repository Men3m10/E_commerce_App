// const slugify = require("slugify");
// const asyncHandler = require("express-async-handler");

// const ApiErr = require("../utils/apiError");
// const ApiFeatures = require("../utils/apiFeatures");
const Factory = require("./handlerFactory");

///////////////////////Models//////////////////////////
const SubCategory = require("../models/subCategoryModel");
///////////////////////////////////////////////////////
module.exports = {
  //nested Route(create)
  setCategoryIdToBody: (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();

    //
  },
  createFilterObject: (req, res, next) => {
    //nested Route
    let filterObject = {};
    if (req.params.categoryId)
      filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
    next();
  },
  createSubCategory: Factory.createOne(SubCategory),
  //@desc     create subCategory
  //route     POST /api/v1/subcategories
  //access    private
  //******************************************************************************* */
  //   //@desc     get All subCategories inside category by id
  //   //route     GET /api/v1/categories/:categoryId/subcategories
  //   //access    public
  getsubCategories: Factory.getAll(SubCategory),
  //@desc     get list of subCategory
  //route     GET /api/v1/subcategories
  //access    public
  //********************************************************************************* */
  getsubCategory: Factory.getOnebyId(SubCategory, "SubCategory"),

  //@desc     get specific subCategory by id
  //route     GET /api/v1/subcategories/:id
  //access    public
  updatesubCategory: Factory.updateOnebyId(SubCategory, "SubCategory"),

  //@desc    update specific subCategory by id
  //route     PUT /api/v1/subcategories/:id
  //access    private
  deletesubCategory: Factory.deleteOne(SubCategory, "SubCategory"),

  //@desc    delete specific subCategory by id
  //route     DELETE /api/v1/subcategories/:id
  //access    private
};
