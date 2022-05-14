const express = require("express");
const route = express.Router();

route.post("/register", async (req, res, next) => {
  try {
    return res.send("xxx");
  } catch (error) {
    next(error);
  }
});

module.exports = route;
