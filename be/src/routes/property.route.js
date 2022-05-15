const express = require("express");
const { admin } = require("../controllers/property");
const router = express.Router();

router.route("/property").post(admin.create).get(admin.find);
router
  .route("/property/:id")
  .get(admin.findByid)
  .put(admin.update)
  .delete(admin.remove);

module.exports = router;
