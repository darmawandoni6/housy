const express = require("express");
const { uploadProperty } = require("../controllers/propertyImage");
const jwt = require("../helpers/jwt");
const router = express.Router();

router.post("/upload-property/:id", jwt.verifyAccessToken, uploadProperty);

module.exports = router;
