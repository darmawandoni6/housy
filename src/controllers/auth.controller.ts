import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

import RoleModel, { Role } from "@models/role";
import UserModel from "@models/user";

import bcrypt from "@utils/bcrypt";
import { ResponseBody } from "@utils/env.t";
import jwt from "@utils/jwt";

import sequelize from "@database/sequelize";

export default {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    try {
      const find = await UserModel.findOne({
        where: {
          username: req.body.username,
        },
      });

      if (find) {
        next(createHttpError.Conflict("User has been registered"));
        return;
      }
      const payloadUser = {
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        password: bcrypt.encrypt(req.body.password),
      };
      const user = await UserModel.create(payloadUser, { transaction: t });

      const payloadRole = req.body.roles.map((item: Role) => ({ name: item, userId: user.id }));
      await RoleModel.bulkCreate(payloadRole, { transaction: t });

      t.commit();

      const response: ResponseBody = {
        status: 200,
        message: "Create user success.",
        data: null,
      };

      res.send(response);
    } catch (error: any) {
      t.rollback();
      next(createHttpError.BadRequest(error.message));
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const find = await UserModel.findOne({
        where: {
          username: req.body.username,
        },
        include: [
          {
            model: RoleModel,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!find) {
        next(createHttpError.NotFound("Username/password not found."));
        return;
      }

      const match = bcrypt.compare(req.body.password, find.password);
      if (!match) {
        next(createHttpError.NotFound("Username/password not found."));
        return;
      }

      const token = jwt.signToken({
        id: find.id,
        username: find.username,
        fullName: find.fullName,
        email: find.email,
        gender: find.gender,
        phone: find.phone,
        address: find.address,
        roles: find.roles,
      });

      const expires = new Date(); // Now
      expires.setDate(expires.getDate() + parseInt(process.env.EXP_TOKEN as string, 10)); // Set now + 30 days as the new date

      res.cookie("token", token, { httpOnly: true, expires });

      const response: ResponseBody = {
        status: 200,
        message: "login success.",
        data: {
          token,
          expires,
        },
      };

      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
};
