const express = require("express");
const { uploadFile } = require("../controllers/file");
const jwt = require("../helpers/jwt");
const route = express.Router();

route.post("/file", jwt.verifyAccessToken, uploadFile);

module.exports = route;
