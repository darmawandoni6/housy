const express = require("express");
const cors = require("cors");
const response = require("./helpers/response");
const httpError = require("http-errors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
