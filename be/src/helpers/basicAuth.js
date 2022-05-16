const basicAuth = require("basic-auth");
const httpError = require("http-errors");

module.exports = {
  verifyBasicAuth: (req, res, next) => {
    const { name, pass } = basicAuth(req);
    if (
      name === process.env.BASIC_USERNAME &&
      pass === process.env.BASIC_PASSWORD
    )
      return next();
    return next(httpError.Unauthorized());
  },
};
