const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

module.exports = {
  //@desc    add product to wishlist
  //route     POST /api/v1/wishlist
  //access    protected/user
  addProductToWishlist: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "product added to your wishlist successfully",
      data: user.wishlist,
    });
  }),

  //@desc    remove product from wishlist
  //route     DELETE /api/v1/wishlist/:productId
  //access    protected/user
  removeProductFromWishlist: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "product removed from your wishlist successfully",
      data: user.wishlist,
    });
  }),

  //@desc    get logged user wishlist
  //route     GET /api/v1/wishlist
  //access    protected/user
  getLoggedUserWishlist: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
      status: "success",
      result: user.wishlist.length,
      data: user.wishlist,
    });
  }),
};
