import { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";
import { Op } from "sequelize";

import AmenityModel from "@models/amenity";
import ImageFileModel from "@models/imageFile";
import PropertyModel from "@models/property";
import PropertyImageModel from "@models/propertyImage";
import TypeOfRentModel from "@models/typeofRent";

import { AmenityWhere, MarkeplaceQueryParam, PropertyWhere, ResponseBody, TypeOfRentWhere } from "@utils/env.t";

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

      const payloadTypeOfRent = req.body.typeOfRent.map((item: { type: string; price: number }) => ({
        type: item.type,
        price: item.price,
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

      const payloadImage = req.body.images.map((item: number) => ({ fileId: item, propertyId: property.id }));
      await PropertyImageModel.create(payloadImage, { transaction: t });

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
      const payloadTypeOfRent = req.body.typeOfRent.map((item: { type: string; price: number }) => ({
        type: item.type,
        price: item.price,
        propertyId: property.id,
      }));
      await TypeOfRentModel.bulkCreate(payloadTypeOfRent, { transaction: t });

      const payloadAmenity = {
        furnished: req.body.amenity.furnished,
        petAllowed: req.body.amenity.petAllowed,
        sharedAccomodation: req.body.amenity.sharedAccomodation,
      };
      await AmenityModel.update(payloadAmenity, { where: { propertyId: property.id }, transaction: t });

      await PropertyImageModel.destroy({ where: { propertyId: property.id }, transaction: t });
      const payloadImage = req.body.images.map((item: number) => ({ fileId: item }));
      await PropertyImageModel.update(payloadImage, { where: { propertyId: property.id }, transaction: t });

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
            attributes: ["id", "type", "price", "isSoldOut"],
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
            attributes: ["id", "type", "price"],
          },
          {
            model: AmenityModel,
            attributes: {
              exclude: ["propertyId", "createdAt", "updatedAt"],
            },
          },
          {
            model: PropertyImageModel,
            attributes: ["id"],
            include: [
              {
                model: ImageFileModel,
                attributes: ["id", "fileUrl"],
              },
            ],
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
  marketplaceAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const propertyWhere: PropertyWhere = {};
      const amenityWhere: AmenityWhere = {};
      const typeOfRentWhere: TypeOfRentWhere = {};

      const query: MarkeplaceQueryParam = {
        page: parseInt(req.query.page as string, 10),
        limit: parseInt(req.query.limit as string, 10),
        typeOfRent: req.query.typeOfRent as string,
        bathroom: parseInt(req.query.bathroom as string, 10),
        bedroom: parseInt(req.query.bedroom as string, 10),
        furnished: req.query.furnished as string,
        petAllowed: req.query.petAllowed as string,
        sharedAccomodation: req.query.sharedAccomodation as string,
        price: parseInt(req.query.price as string, 10),
        search: req.query.search as string,
      };

      // PropertyModel
      if (query.bathroom) {
        if (query.bathroom < 5) {
          propertyWhere.bathroom = query.bathroom;
        } else {
          propertyWhere.bathroom = { [Op.gte]: query.bathroom };
        }
      }
      if (query.bedroom) {
        if (query.bedroom < 5) {
          propertyWhere.bedroom = query.bedroom;
        } else {
          propertyWhere.bedroom = { [Op.gte]: query.bedroom };
        }
      }
      if (query.search) {
        propertyWhere.name = { [Op.like]: `%${query.search.toLocaleLowerCase()}%` };
      }

      // AmenityModel
      if (query.furnished) amenityWhere.furnished = query.furnished === "true";
      if (query.petAllowed) amenityWhere.petAllowed = query.petAllowed === "true";
      if (query.sharedAccomodation) amenityWhere.sharedAccomodation = query.sharedAccomodation === "true";

      // TypeOfRentModel
      if (query.typeOfRent) {
        typeOfRentWhere.type = { [Op.in]: query.typeOfRent.split(",") };
      }
      if (query.price) {
        typeOfRentWhere.price = { [Op.lte]: query.price };
      }

      const property = await PropertyModel.findAndCountAll({
        offset: (query.page - 1) * query.limit,
        limit: query.limit,
        distinct: true,
        where: {
          ...propertyWhere,
        },
        include: [
          {
            model: AmenityModel,
            attributes: {
              exclude: ["propertyId", "createdAt", "updatedAt"],
            },
            where: {
              ...amenityWhere,
            },
          },
          {
            model: TypeOfRentModel,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            where: { isSoldOut: false, ...typeOfRentWhere },
          },
          {
            model: PropertyImageModel,
            attributes: ["id"],
            include: [
              {
                model: ImageFileModel,
                attributes: ["id", "fileUrl"],
              },
            ],
          },
        ],
      });
      const response: ResponseBody = {
        status: 200,
        message: "Succes get all",
        data: property.rows,
        pagination: {
          page: query.page,
          limit: query.limit,
          totalPage: Math.ceil(property.count / query.limit),
          count: property.count,
        },
      };
      res.send(response);
    } catch (error: any) {
      next(createHttpError.BadRequest(error.message));
    }
  },
  marketplaceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const property = await PropertyModel.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: TypeOfRentModel,
            attributes: ["id", "type", "price"],
          },
          {
            model: AmenityModel,
            attributes: {
              exclude: ["propertyId", "createdAt", "updatedAt"],
            },
          },
          {
            model: PropertyImageModel,
            attributes: ["id"],
            include: [
              {
                model: ImageFileModel,
                attributes: ["id", "fileUrl"],
              },
            ],
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
