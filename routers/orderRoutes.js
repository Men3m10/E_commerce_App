const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderPaid,
  updateOrderShipped,
  checkoutSession,
} = require("../controllers/orderController");

Router.use(auth.Protect, check.checkActiveUser);
Router.get(
  "/checkout-session/:cartId",
  auth.allowedTo("user"),
  checkoutSession
);

Router.post("/:cartId", auth.allowedTo("user"), createCashOrder);
Router.get(
  "/",
  auth.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);
Router.get("/:id", findSpecificOrder);
Router.put("/:orderId/pay", auth.allowedTo("admin"), updateOrderPaid);
Router.put("/:orderId/shipped", auth.allowedTo("admin"), updateOrderShipped);

module.exports = Router;
