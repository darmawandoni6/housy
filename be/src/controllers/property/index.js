const httpError = require("http-errors");
const response = require("../../helpers/response");
const { create, find } = require("./service");

module.exports = {
  admin: require("./admin"),
};
