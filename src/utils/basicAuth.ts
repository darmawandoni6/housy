import { NextFunction, Request, Response } from "express";

import basicAuth from "basic-auth";
import createHttpError from "http-errors";

export const verifyBasicAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = basicAuth(req);
  if (auth?.name === process.env.BASIC_AUTH_USERNAME && auth?.pass === process.env.BASIC_AUTH_PASSWORD) {
    next();
    return;
  }

  next(createHttpError.Unauthorized());
};
