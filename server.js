const path = require("path");

const compression = require("compression");
const rateLimit = require("express-rate-limit");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const ApiErr = require("./utils/apiError");
const ErrorMiddleware = require("./middlewares/errMiddleware");
const DBconnection = require("./config/database");

const { webhockCheckout } = require("./controllers/orderController");

dotenv.config({ path: "config.env" });

//////////////    Connect with DB  ///////////////////
DBconnection();
////////////////////////////////////
// express
const app = express();

//enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all response
app.use(compression());

//checkOut webhock
app.post(
  "/wehock-checkout",
  express.raw({ type: "application/json" }),
  webhockCheckout
);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "/uploads")));

////////////////////Models////////////////
const Routes = require("./routers");
//////////////////////////////////////////
////////////////////Routes////////////////
// To apply data sanitization
app.use(mongoSanitize());
app.use(xss());

//limit each IP request for 100 time per window
const limiter = rateLimit({
  //for security//
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

//Express middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ["price", "quantity", "sold", "ratingsAverage", "ratingPersons"],
  })
);

Routes(app);

app.all("*", (req, res, next) => {
  //هيشوف كل الراوتس اللي فوق لو ملقاش اللي انا دخلته هيخش علي دي
  //احنا عاملين الايرور دا علشان لو دخلنا راوت مش موجود اصلا يرجع يقولي انه م موجود
  // const err = new Error(`Can not find this route ${req.originalUrl}`);
  next(new ApiErr(`Can not find this route ${req.originalUrl}`, 400));
});
/////////////////////////////////////////////
//error handling middleware for express
app.use(ErrorMiddleware);
//////////////////////////////////////////

//middleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Your port is running : ${PORT}`);
});

// اي ايرور هيحصل خارج اكسبريس مش معمول ليه هندله دا هيلقطه و يجيبه
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors ${err.name} |${err.message}`);
  server.close(() => {
    console.error(` server => shutting down ...`);
    process.exit(1);
  });
});
