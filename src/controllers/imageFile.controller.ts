import { NextFunction, Request, Response } from "express";

import crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";

import ImageFileModel from "@models/imageFile";

import { ResponseBody } from "@utils/env.t";

export default {
  uploadFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files) {
        next(createHttpError.BadRequest());
        return;
      }

      const profile = req.files.profile as UploadedFile;

      let create;

      const regex = /image\/*/;

      if (profile) {
        const { truncated, mimetype } = profile;
        if (!truncated && regex.test(mimetype)) {
          create = await ImageFileModel.create({
            file: profile.data,
            type: "profile",
            fileUrl: crypto.randomUUID(),
          });
        } else {
          next(createHttpError.BadRequest());
          return;
        }
      }

      if (!create) {
        next();
      }
      const response: ResponseBody = {
        status: 200,
        message: "Upload file success",
        data: { ...create?.dataValues, file: undefined },
      };

      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
  readFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const find = await ImageFileModel.findOne({
        where: {
          fileUrl: req.params.id,
        },
      });
      if (!find) {
        res.end();
      }

      res.end(find?.file);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
};
