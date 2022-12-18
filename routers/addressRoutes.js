const express = require("express");

const Router = express.Router();
const auth = require("../controllers/authController");
const check = require("../controllers/userController");

const {
  addAddress,
  getLoggedUserAddress,
  removeAddress,
} = require("../controllers/addresController");

Router.use(auth.Protect, check.checkActiveUser, auth.allowedTo("user"));

Router.post("/", addAddress);
Router.get("/", getLoggedUserAddress);
Router.delete("/:addressId", removeAddress);

module.exports = Router;
