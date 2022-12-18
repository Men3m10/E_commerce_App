const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiErr = require("../utils/apiError");
const generateToken = require("../utils/createToken");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const Factory = require("./handlerFactory");

const User = require("../models/userModel");

///////////////////////////////////////////////////////

module.exports = {
  uploadBrandImage: uploadSingleImage("userImg"),

  resizeImage: asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/users/${filename}`);
      //save image to our dataBase
      req.body.userImg = filename;
    }

    next();
  }),

  createUser: Factory.createOne(User),
  //@desc     create User
  //route     POST /api/v1/Users
  //access    private

  getUsers: Factory.getAll(User),
  //@desc     get list of User
  //route     GET /api/v1/Users
  //access    private

  getUser: Factory.getOnebyId(User, "User"),

  //@desc     get specific User by id
  //route     GET /api/v1/Users/:id
  //access    private

  updateUser: asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        userImg: req.body.userImg,
      },
      {
        new: true,
      }
    );
    if (!document) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    res.status(200).json({ data: document });
  }),
  //@desc    update specific User by id
  //route     PUT /api/v1/Users/:id
  //access    private

  updateUserPassword: asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    if (!document) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    res.status(200).json({ data: document });
  }),
  //@desc    update specific UserPassword by id
  //route     PUT /api/v1/Users/:id
  //access    private

  deleteUser: Factory.deleteOne(User, "User"),
  //@desc    delete specific User by id
  //route     DELETE /api/v1/Users/:id
  //access    private

  getLoggedUserData: asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
  }),
  //@desc     get logged user data
  //route     GET /api/v1/Users/getMyData
  //access    private/protect

  updateLoggedUserPassword: asyncHandler(async (req, res, next) => {
    //1)update logged user passwored based on payload(user._id) from protect route
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    if (!user) {
      return next(new ApiErr(`no user with this id`, 404));
    }

    //2) generate token
    const token = generateToken(user._id);

    res.status(200).json({ data: user, token });
  }),
  //@desc    update specific loggedUserPassword by id  user_id
  //route     PUT /api/v1/Users/updateMyPassword
  //access    private/Protect
  updateLoggedUserData: asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Data Updated Succesfully", data: updatedUser });
  }),
  //@desc    update specific LoggedUserData by id   user_id  (without password , role)
  //route     PUT /api/v1/Users/updateMyData
  //access    private/Protect

  deactiveLoggedUserData: asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({ message: "success" });
  }),

  //@desc    Deactivate specific LoggedUser
  //route     DELETE /api/v1/Users/deactiveMe
  //access    private/Protect

  activeLoggedUserData: asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: true });
    res.status(200).json({ message: "success" });
  }),

  //@desc    activate specific LoggedUser
  //route     PUT /api/v1/Users/activeMe
  //access    private/Protect

  checkActiveUser: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id);

    if (user.active == false) {
      return next(new ApiErr("this user is not active", 401));
    }
    next();
  }),
};
