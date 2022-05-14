const express = require("express");
const { updateUser, changePassword } = require("../controllers/user");
const jwt = require("../helpers/jwt");
const route = express.Router();

route.put("/user", jwt.verifyAccessToken, updateUser);
route.put("/change-password", jwt.verifyAccessToken, changePassword);

module.exports = route;
