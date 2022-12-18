const express = require("express");

const Router = express.Router();
const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

Router.use(auth.Protect, check.checkActiveUser, auth.allowedTo("user"));

Router.post("/", addProductToWishlist);
Router.get("/", getLoggedUserWishlist);
Router.delete("/:productId", removeProductFromWishlist);

module.exports = Router;
