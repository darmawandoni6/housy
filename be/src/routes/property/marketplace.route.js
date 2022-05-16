const express = require("express");
const { marketplace } = require("../../controllers/property");
const basicAuth = require("../../helpers/basicAuth");
const router = express.Router();

router.route("/property").get(basicAuth.verifyBasicAuth, marketplace.find);
router
  .route("/property/:id")
  .get(basicAuth.verifyBasicAuth, marketplace.findByid);

module.exports = router;
