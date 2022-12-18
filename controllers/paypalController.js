const asyncHandler = require("express-async-handler");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

exports.CreatePaypalPayment = asyncHandler(
  async (payment) =>
    new Promise((resolve, reject) => {
      paypal.payment.create(payment, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    })
);
