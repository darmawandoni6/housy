const express = require("express");
const { uploadFile } = require("../controllers/file");
const route = express.Router();

route.post("/file", uploadFile);

module.exports = route;
