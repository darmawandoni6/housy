const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = {
  signToken: (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN, {
      expiresIn: `${process.env.EXP_TOKEN}d`,
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"])
      return next(createHttpError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;

        return next(createHttpError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
};
