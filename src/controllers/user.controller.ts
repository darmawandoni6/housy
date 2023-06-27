import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

import UserModel from "@models/user";

import bcrypt from "@utils/bcrypt";
import { ResponseBody } from "@utils/env.t";

export default {
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;
      const user = await UserModel.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password", "roleId"] },
      });
      if (!user) {
        next(createHttpError.NotFound("User not found."));
        return;
      }

      const reqUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
      };
      await UserModel.update(reqUser, { where: { id: payload.id } });

      const response: ResponseBody = {
        status: 200,
        message: "Success update.",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
  findByid: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;
      const user = await UserModel.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password", "roleId"] },
      });
      if (!user) {
        next(createHttpError.NotFound("User not found."));
        return;
      }
      const response: ResponseBody = {
        status: 200,
        message: "Success find.",
        data: user,
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;
      const user = await UserModel.findOne({
        where: { id: payload.id },
      });
      if (!user) {
        next(createHttpError.NotFound("User not found."));
        return;
      }

      const match = bcrypt.compare(req.body.password, user.password);
      if (!match) {
        next(createHttpError.NotFound("Username/password not found."));
        return;
      }

      const reqUser = {
        password: bcrypt.encrypt(req.body.newPassword),
      };
      await UserModel.update(reqUser, { where: { id: payload.id } });

      const response: ResponseBody = {
        status: 200,
        message: "Success change password.",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
};
