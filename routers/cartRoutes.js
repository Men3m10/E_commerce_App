const express = require("express");

const Router = express.Router();

const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantaty,
  applyCoupon,
} = require("../controllers/cartcontroller");

Router.use(auth.Protect, check.checkActiveUser, auth.allowedTo("user"));

Router.post("/", addProductToCart);
Router.delete("/", clearCart);
Router.get("/getMyCart", getLoggedUserCart);
Router.put("/applyCoupon", applyCoupon);
Router.put("/:itemId", updateCartItemQuantaty);
Router.delete("/:itemId", removeSpecificCartItem);

module.exports = Router;
