const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//const paypal = require("paypal-rest-sdk");

const asyncHandler = require("express-async-handler");
const ApiErr = require("../utils/apiError");
const Factory = require("./handlerFactory");

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

//const paypalService = require("./paypalController");

module.exports = {
  // @desc    create cash order
  // @route   POST /api/v1/orders/:cartId
  // @access  Protected/User
  createCashOrder: asyncHandler(async (req, res, next) => {
    //app setting
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiErr("No cart with this id", 404));
    }
    // 2) Get order price depend on cart price "Check if coupon apply"
    const PriceOfCart = cart.priceAfterDiscount
      ? cart.priceAfterDiscount
      : cart.totalPrice;
    const totalPrice = PriceOfCart + taxPrice + shippingPrice;
    // 3) Create order with default paymentMethodType cash
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalPrice,
    });
    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantaty, sold: +item.quantaty } },
        },
      }));
      await Product.bulkWrite(bulkOption);
      // 5) Clear cart depend on cartId
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(200).json({ status: "success", data: order });
  }),

  filterOrderForLoggedUser: asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObject = { user: req.user._id };
    next();
  }),
  // @desc    get All orders
  // @route   POST /api/v1/orders/
  // @access  Protected/User-Admin-Maanger
  findAllOrders: Factory.getAll(Order, "Order"),

  // @desc    get All orders
  // @route   POST /api/v1/orders/
  // @access  Protected/User-Admin-Maanger
  findSpecificOrder: Factory.getOnebyId(Order, "Order"),

  // @desc    update order paid status
  // @route   POST /api/v1/orders/:orderId/pay
  // @access  Protected/Admin-Maanger

  updateOrderPaid: asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ApiErr("can not find ordewr with this id", 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Paid updated",
      orderData: updatedOrder,
    });
  }),

  // @desc    update order shipping status
  // @route   POST /api/v1/orders/:orderId/shipped
  // @access  Protected/Admin-Maanger

  updateOrderShipped: asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new ApiErr("can not find ordewr with this id", 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Deliverd updated",
      orderData: updatedOrder,
    });
  }),

  // @desc    get checkout session from stripe and send it as response
  // @route   GET /api/v1/orders/checkout-session/:cartId/
  // @access  Protected/user
  checkoutSession: asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(
        new ApiErr(`There is no such cart with id ${req.params.cartId}`, 404)
      );
    }

    // 2) Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.priceAfterDiscount
      ? cart.priceAfterDiscount
      : cart.totalPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    ////////////////////////////////////paypal////////////////////////////////////////////////////////////
    // let payment = {
    //   intent: "sale",
    //   payer: {
    //     payment_method: "paypal",
    //   },
    //   redirect_urls: {
    //     return_url: `${req.protocol}://${req.get("host")}/orders`,
    //     cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    //   },
    //   transactions: [
    //     {
    //       item_list: {
    //         items: [
    //           {
    //             name: req.user.name,
    //             price: cart.totalPrice,
    //             currency: "USD",
    //             quantity: 1,
    //           },
    //         ],
    //       },
    //       amount: {
    //         currency: "USD",
    //         total: totalOrderPrice,
    //       },
    //     },
    //   ],
    // };

    // paypalService
    //   .CreatePaypalPayment(payment)
    //   .then((transaction) => {
    //     const transactionId = transaction.id;
    //     // 4) send session to response
    //     res.status(200).json({
    //       status: "success",
    //       message: "create payment method",
    //       Transaction: transaction,
    //       id: transactionId,
    //       customer_email: req.user.email,
    //       client_reference_id: req.params.cartId,
    //       metadata: req.body.shippingAddress,
    //     });
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // 3) Create stripe checkout session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            // The currency parameter determines which
            // payment methods are used in the Checkout Session.
            currency: "egp",
            product_data: {
              name: req.user.name,
            },
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
    });

    res.status(200).json({
      status: "success",
      message: "create payment method",
      session,
    });
  }),

  webhockCheckout: asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      console.log("create order here");
    }
  }),
};
