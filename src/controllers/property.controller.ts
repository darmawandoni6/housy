import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";

import AmenityModel from "@models/Amenity";
import PropertyModel from "@models/property";
import TypeOfRentModel from "@models/typeofRent";

import { ResponseBody } from "@utils/env.t";

import sequelize from "@database/sequelize";

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    try {
      const { payload } = res.locals;

      const payloadProperty = {
        name: req.body.name,
        address: req.body.address,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        userId: payload.id,
        area: req.body.area,
        description: req.body.description,
      };
      const property = await PropertyModel.create(payloadProperty, { transaction: t });

      const payloadTypeOfRent = req.body.typeOfRent.map((item: Array<string>) => ({
        type: item,
        propertyId: property.id,
      }));
      await TypeOfRentModel.bulkCreate(payloadTypeOfRent, { transaction: t });

      const payloadAmenity = {
        furnished: req.body.amenity.furnished,
        petAllowed: req.body.amenity.petAllowed,
        sharedAccomodation: req.body.amenity.sharedAccomodation,
        propertyId: property.id,
      };

      await AmenityModel.create(payloadAmenity, { transaction: t });

      await t.commit();

      const response: ResponseBody = {
        status: 200,
        message: "Succes create.",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      t.rollback();
      next(createHttpError.BadRequest(error.message));
    }
  },
  edit: async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();

    try {
      const { payload } = res.locals;

      const payloadProperty = {
        name: req.body.name,
        address: req.body.address,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        userId: payload.id,
        area: req.body.area,
        description: req.body.description,
      };

      const property = await PropertyModel.findOne({ where: { id: req.params.id, userId: payload.id } });
      if (!property) {
        next(createHttpError.NotFound());
        return;
      }

      await PropertyModel.update(payloadProperty, { where: { id: req.params.id, userId: payload.id }, transaction: t });

      await TypeOfRentModel.destroy({ where: { propertyId: property.id }, transaction: t });
      const payloadTypeOfRent = req.body.typeOfRent.map((item: Array<string>) => ({
        type: item,
        propertyId: property.id,
      }));
      await TypeOfRentModel.bulkCreate(payloadTypeOfRent, { transaction: t });

      const payloadAmenity = {
        furnished: req.body.amenity.furnished,
        petAllowed: req.body.amenity.petAllowed,
        sharedAccomodation: req.body.amenity.sharedAccomodation,
      };

      await AmenityModel.update(payloadAmenity, { where: { propertyId: property.id }, transaction: t });

      t.commit();

      const response: ResponseBody = {
        status: 200,
        message: "success edit",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      t.rollback();
      next(createHttpError.BadRequest(error.message));
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();

    try {
      const { payload } = res.locals;

      const property = await PropertyModel.findOne({
        where: { userId: payload.id, id: req.params.id },
      });
      if (!property) {
        next(createHttpError.NotFound());
        return;
      }

      await TypeOfRentModel.destroy({ where: { propertyId: property.id }, transaction: t });
      await AmenityModel.destroy({ where: { propertyId: property.id }, transaction: t });
      await PropertyModel.destroy({ where: { id: req.params.id }, transaction: t });

      t.commit();

      const response: ResponseBody = {
        status: 200,
        message: "succes remove",
        data: null,
      };
      res.send(response);
    } catch (error: any) {
      t.rollback();
      next(createHttpError.BadRequest(error.message));
    }
  },
  findAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;
      const property = await PropertyModel.findAll({
        where: { userId: payload.id },
        include: [
          {
            model: TypeOfRentModel,
            attributes: ["id", "type"],
          },
          {
            model: AmenityModel,
            attributes: {
              exclude: ["propertyId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      const response: ResponseBody = {
        status: 200,
        message: "Succes get all",
        data: property,
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
  findById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = res.locals;
      const property = await PropertyModel.findOne({
        where: { userId: payload.id, id: req.params.id },
        include: [
          {
            model: TypeOfRentModel,
            attributes: ["id", "type"],
          },
          {
            model: AmenityModel,
            attributes: {
              exclude: ["propertyId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      const response: ResponseBody = {
        status: 200,
        message: "success get by id",
        data: property,
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
};
