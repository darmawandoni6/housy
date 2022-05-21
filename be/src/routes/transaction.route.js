const express = require("express");
const { find, updateStatus } = require("../controllers/transaction");
const jwt = require("../helpers/jwt");
const router = express.Router();

router.get("/transaction", jwt.verifyAccessToken, find);
router.put("/transaction/:id", jwt.verifyAccessToken, updateStatus);

module.exports = router;
