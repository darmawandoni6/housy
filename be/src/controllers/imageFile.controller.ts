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

      const { profile, property } = req.files;

      const regex = /image\/*/;
      let payload;

      if (profile) {
        const { truncated, mimetype, data } = profile as UploadedFile;
        if (!truncated && regex.test(mimetype)) {
          payload = {
            file: data,
            type: "profile",
            fileUrl: crypto.randomUUID(),
          };
        } else {
          next(createHttpError.BadRequest("Size to large or file only image"));
          return;
        }
      } else if (property) {
        const { truncated, mimetype, data } = property as UploadedFile;
        if (!truncated && regex.test(mimetype)) {
          payload = {
            file: data,
            type: "property",
            fileUrl: crypto.randomUUID(),
          };
        } else {
          next(createHttpError.BadRequest("Size to large or file only image"));
          return;
        }
      }

      if (!payload) {
        next(createHttpError.BadRequest("Request failed."));
        return;
      }
      const create = await ImageFileModel.create(payload);
      if (!create) {
        next();
        return;
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
