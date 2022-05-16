const express = require("express");
const {
  find,
  create,
  cancelBooking,
  paymentBooking,
} = require("../controllers/booking");
const router = express.Router();
const jwt = require("../helpers/jwt");

router
  .route("/booking")
  .get(jwt.verifyAccessToken, find)
  .post(jwt.verifyAccessToken, create);
router.put("/booking/cancel/:id", jwt.verifyAccessToken, cancelBooking);
router.put("/booking/payment/:id", jwt.verifyAccessToken, paymentBooking);

module.exports = router;
