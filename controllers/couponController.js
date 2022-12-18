const Factory = require("./handlerFactory");

const Coupon = require("../models/couponModel");

///////////////////////////////////////////////////////

module.exports = {
  createCoupon: Factory.createOne(Coupon),
  //@desc     create Coupon
  //route     POST /api/v1/coupons
  //access    private/admin-manager

  getCoupons: Factory.getAll(Coupon),
  //@desc     get list of Coupon
  //route     GET /api/v1/coupons
  //access    public/admin-manager

  getCoupon: Factory.getOnebyId(Coupon, "Coupon"),

  //@desc     get specific Coupon by id
  //route     GET /api/v1/coupons/:id
  //access    public/admin-manager

  updateCoupon: Factory.updateOnebyId(Coupon, "Coupon"),
  //@desc    update specific Coupon by id
  //route     PUT /api/v1/coupons/:id
  //access    private/admin-manager

  deleteCoupon: Factory.deleteOne(Coupon, "Coupon"),
  //@desc    delete specific Coupon by id
  //route     DELETE /api/v1/coupons/:id
  //access    private/admin-manager
};
