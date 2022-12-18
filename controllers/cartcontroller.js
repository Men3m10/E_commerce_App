const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const ApiError = require("../utils/apiError");
///////////////////////////////////////////////////////

const calcTotalPrice = (cart) => {
  let totalPriceInCart = 0;
  cart.cartItems.forEach((item) => {
    totalPriceInCart += item.quantaty * item.price;
  });
  cart.totalPrice = totalPriceInCart;
  cart.priceAfterDiscount = undefined;
  return totalPriceInCart;
};

module.exports = {
  //@desc     add product to cart
  //route     POST /api/v1/cart
  //access    private/user
  addProductToCart: asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);

    //1)get cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });
    //لو مفيش كارت اعمل كرييت
    if (!cart) {
      //create cart for logged user
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [{ product: productId, price: product.price, color }],
      });
    } else {
      //لقينا فيه كارت خلاص هات البرودكت اللي هو باعته و شوفه لو موجود قبل كدا اصلا زود الكميه ب واحد
      //if product exist -->quantaty+1
      ////get Index of product
      const cartIndex = cart.cartItems.findIndex(
        (items) =>
          items.product.toString() === productId && items.color === color
      );
      if (cartIndex > -1) {
        const cartItem = cart.cartItems[cartIndex];
        cartItem.quantaty += 1;
        cart.cartItems[cartIndex] = cartItem;
      } else {
        //لقينا فيه كارد و البرودكت اللي هو باعته متغير فيه لون او اصلا واحد تاني ف هيحطه
        //product no exist ,->push in cart
        cart.cartItems.push({
          product: productId,
          price: product.price,
          color,
        });
      }
    }
    //calculate total price for all products
    calcTotalPrice(cart);

    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product added successfully",
      numOfItemsInCart: cart.cartItems.length,
      yourCart: cart,
    });
  }),

  //@desc     get logged user cart
  //route     POST /api/v1/cart
  //access    private/user
  getLoggedUserCart: asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(
        new ApiError(
          "the cart is empty ,please select product and check again",
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      numOfItemsInCart: cart.cartItems.length,
      data: cart,
    });
  }),

  //@desc     remove specific cart item
  //route     DELETE /api/v1/cart/:itemId
  //access    private/user

  removeSpecificCartItem: asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true }
    );
    //calculate total price for all products
    calcTotalPrice(cart);

    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product removed successfully",
      numOfItemsInCart: cart.cartItems.length,
      yourCart: cart,
    });
  }),

  //@desc     clear  cart
  //route     DELETE /api/v1/cart/
  //access    private/user

  clearCart: asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: "Cart is clear !" });
  }),

  //@desc     update specific cart item quantaty
  //route     PUT /api/v1/cart/:itemId
  //access    private/user

  updateCartItemQuantaty: asyncHandler(async (req, res, next) => {
    const { quantaty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return next(
        new ApiError(
          "the cart is empty ,please select product and check again ",
          404
        )
      );
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantaty = quantaty;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      return next(new ApiError("there is no item for this id", 404));
    }
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "quantaty updated successfully",
      numOfItemsInCart: cart.cartItems.length,
      yourCart: cart,
    });
  }),

  //@desc     apply coupon on cart
  //route     PUT /api/v1/cart/applyCoupon
  //access    private/user
  applyCoupon: asyncHandler(async (req, res, next) => {
    const { coupon } = req.body;
    //get coupon by name and coupon is valid
    const couponn = await Coupon.findOne({
      name: coupon,
      expiredDate: { $gt: Date.now() },
    });
    if (!couponn) {
      return next(new ApiError("coupon is invalid or expired"));
    }

    //check coupon number of use
    if (couponn.numberOfuse == 0) {
      return next(new ApiError("coupon reach max of use"));
    }

    //get logged user cart to apply coupon on total price
    const cart = await Cart.findOne({ user: req.user._id });
    const totalPriceinCart = cart.totalPrice;
    const totalPriceAfterDiscount = (
      totalPriceinCart -
      (totalPriceinCart * couponn.discount) / 100
    ).toFixed(2);
    cart.priceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    couponn.numberOfuse -= 1;
    await couponn.save();

    res.status(200).json({
      status: "success",
      message: `${couponn.name} coupon applied successfully`,
      numOfItemsInCart: cart.cartItems.length,
      yourCart: cart,
    });
  }),
};
