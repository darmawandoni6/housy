const express = require("express");
const { updateUser, changePassword } = require("../controllers/user");
const route = express.Router();

route.put("/user", updateUser);
route.put("/change-password", changePassword);

module.exports = route;
