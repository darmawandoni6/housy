const express = require("express");
const { admin } = require("../../controllers/property");
const jwt = require("../../helpers/jwt");
const router = express.Router();

router
  .route("/property")
  .post(jwt.verifyAccessToken, admin.create)
  .get(jwt.verifyAccessToken, admin.find);
router
  .route("/property/:id")
  .get(jwt.verifyAccessToken, admin.findByid)
  .put(jwt.verifyAccessToken, admin.update)
  .delete(jwt.verifyAccessToken, admin.remove);

module.exports = router;
