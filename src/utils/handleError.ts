import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const code = err.status || 500;

  res.status(code);
  next();
  res.send({
    status: err.status,
    message: err.message,
    data: null,
  });
};
