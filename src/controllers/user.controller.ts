import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

import ImageFileModel from "@models/imageFile";
import RoleModel from "@models/role";
import UserModel from "@models/user";

import bcrypt from "@utils/bcrypt";
import { ResponseBody } from "@utils/env.t";

import sequelize from "@database/sequelize";

export default {
  update: async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    try {
      const { payload } = res.locals;
      const user = await UserModel.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password"] },
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
        fileId: req.body.fileId,
      };

      await UserModel.update(reqUser, { where: { id: payload.id }, transaction: t });
      if (reqUser.fileId) {
        await ImageFileModel.update({ status: true }, { where: { id: reqUser.fileId }, transaction: t });
      }

      t.commit();

      const response: ResponseBody = {
        status: 200,
        message: "Success update.",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      t.rollback();
      next(createHttpError.BadRequest(error.message));
    }
  },
  findByid: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;

      const user = await UserModel.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password"] },
        include: [
          { model: RoleModel, attributes: ["name", "status"] },
          {
            model: ImageFileModel,
            attributes: ["id", "fileUrl"],
          },
        ],
      });

      if (!user) {
        next(createHttpError.NotFound("User not found."));
        return;
      }

      const result = user;
      if (result.imageFile) {
        result.imageFile.fileUrl = process.env.FILE_URL + "/api-v1/" + result.imageFile.fileUrl;
      }

      const response: ResponseBody = {
        status: 200,
        message: "Success find.",
        data: result,
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
