const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

module.exports = {
  //@desc    add address to user address list
  //route     POST /api/v1/addresses
  //access    protected/user
  addAddress: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { addresses: req.body },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "address added successfully",
      data: user.addresses,
    });
  }),

  //@desc    remove address from address list
  //route     DELETE /api/v1/addresses/:addressId
  //access    protected/user
  removeAddress: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { addresses: { _id: req.params.addressId } },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "address removed successfully",
      data: user.addresses,
    });
  }),

  //@desc    get logged user addresses
  //route     GET /api/v1/addresses
  //access    protected/user
  getLoggedUserAddress: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("addresses");
    res.status(200).json({
      status: "success",
      result: user.addresses.length,
      data: user.addresses,
    });
  }),
};
