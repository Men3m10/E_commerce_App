const Factory = require("./handlerFactory");

const Review = require("../models/reviewModel");

///////////////////////////////////////////////////////

module.exports = {
  //nested Route(create)
  setProductIdAndUserIdToBody: (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();

    //
  },
  //nested Route()
  createFilterObject: (req, res, next) => {
    //nested Route(create)
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObject = filterObject;
    next();
  },

  /////////////////////////////////////////////////////
  createReview: Factory.createOne(Review),
  //@desc     create review
  //route     POST /api/v1/reviews
  //access    private/Protect/User

  getReviews: Factory.getAll(Review),
  //@desc     get list of reviews
  //route     GET /api/v1/reviews
  //access    public

  getReview: Factory.getOnebyId(Review, "Review"),

  //@desc     get specific review by id
  //route     GET /api/v1/reviews/:id
  //access    public

  updateReview: Factory.updateOnebyId(Review, "Review"),
  //@desc    update specific review by id
  //route     PUT /api/v1/reviews/:id
  //access    private/Protect/User

  deleteReview: Factory.deleteOne(Review, "Review"),
  //@desc    delete specific review by id
  //route     DELETE /api/v1/reviews/:id
  //access    private/Protect/User-Admin-Manager
};
