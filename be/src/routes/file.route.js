const express = require("express");
const { uploadFile, uploadFileBooking } = require("../controllers/file");
const jwt = require("../helpers/jwt");

const route = express.Router();

route.post("/file", jwt.verifyAccessToken, uploadFile);
route.post("/file-booking/:id", jwt.verifyAccessToken, uploadFileBooking);

module.exports = route;
