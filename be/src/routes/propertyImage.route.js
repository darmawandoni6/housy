const express = require("express");
const { uploadProperty } = require("../controllers/propertyImage");
const router = express.Router();

router.post("/upload-property/:id", uploadProperty);

module.exports = router;
