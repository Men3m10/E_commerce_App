const express = require("express");

const Router = express.Router();
const auth = require("../controllers/authController");

const {
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
  changePasswordValidator,
  changeLoggedPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validation/userValidation");

const {
  uploadBrandImage,
  resizeImage,
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactiveLoggedUserData,
  activeLoggedUserData,
  checkActiveUser,
} = require("../controllers/userController");
////////////////////////////////////////////////////////////////////////////////////
//for all routes under
Router.use(auth.Protect);

//User
Router.get("/getMyData", checkActiveUser, getLoggedUserData, getUser);
Router.put(
  "/changeMyPassword",
  checkActiveUser,
  changeLoggedPasswordValidator,
  updateLoggedUserPassword
);
Router.put(
  "/updateMyData",
  checkActiveUser,
  updateLoggedUserValidator,
  updateLoggedUserData
);
Router.delete("/deactiveMe", checkActiveUser, deactiveLoggedUserData);
Router.put("/activeMe", activeLoggedUserData);

/////////////////////////////////////////////////////////////////////////////////////
//Admin
//for all routes under
Router.use(auth.allowedTo("admin", "manager"), checkActiveUser);
Router.post(
  "/",
  uploadBrandImage,
  resizeImage,
  createUserValidator,
  createUser
);
Router.get("/", getUsers);

Router.get("/:id", getUserValidator, getUser);

Router.put(
  "/:id",
  uploadBrandImage,
  resizeImage,
  updateUserValidator,
  updateUser
);
Router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);
Router.delete("/:id", deleteUserValidator, deleteUser);

module.exports = Router;
