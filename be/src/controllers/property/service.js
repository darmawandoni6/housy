const Property = require("../../models/property.model");
const Amenities = require("../../models/amenities.model");
const db = require("../../configs/mysql");
const { Op } = require("sequelize");

module.exports = {
  create: async (reqProperty, reqAmenities) => {
    try {
      await db.transaction(async (transaction) => {
        const data = await Property.create(reqProperty, { transaction })
          .then((res) => res.toJSON())
          .catch((e) => {
            throw e.message;
          });
        reqAmenities.propertyId = data.id;

        await Amenities.create(reqAmenities, { transaction }).catch((e) => {
          throw e.message;
        });
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  find: async (id, params) => {
    try {
      let {
        page,
        limit,
        search = "",
        typeOfRent = "",
        bedroom = 1,
        bathroom = 1,
        petAllowed = "",
        furnished = "",
        sharedAccommodation = "",
        price,
      } = params;
      const offset = page * limit - limit;

      const whereAmenities = {};
      const whereProperty = {
        name: {
          [Op.like]: `%${search}%`,
        },
        userId: id,
      };

      if (bedroom > 4) {
        whereProperty.bedroom = {
          [Op.gte]: 5,
        };
      }
      if (bathroom > 4) {
        whereProperty.bathroom = {
          [Op.gte]: 5,
        };
      }

      if (furnished === "true") whereAmenities.furnished = true;
      else if (furnished === "false") whereAmenities.furnished = false;

      if (petAllowed === "true") whereAmenities.petAllowed = true;
      else if (petAllowed === "false") whereAmenities.petAllowed = false;

      if (sharedAccommodation === "true")
        whereAmenities.sharedAccommodation = true;
      else if (sharedAccommodation === "false")
        whereAmenities.sharedAccommodation = false;

      if (price) {
        switch (typeOfRent) {
          case "Day":
            whereProperty.pricePerDay = {
              [Op.lte]: price,
            };
            break;
          case "Month":
            whereProperty.pricePerMonth = {
              [Op.lte]: price,
            };
            break;
          case "Year":
            whereProperty.pricePerYear = {
              [Op.lte]: price,
            };
            break;
          default:
            break;
        }
      }

      const data = await Property.findAndCountAll({
        include: [
          {
            model: Amenities,
            as: "amenities",
            attributes: { exclude: ["createdAt", "updatedAt", "propertyId"] },
          },
        ],
        where: whereProperty,
        offset,
        limit,
      });

      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  finByid: async (where) => {
    try {
      const data = await Property.findOne({
        include: [
          {
            model: Amenities,
            as: "amenities",
            attributes: { exclude: ["createdAt", "updatedAt", "propertyId"] },
          },
        ],
        where,
      })
        .then((res) => res?.toJSON() ?? null)
        .catch((e) => {
          throw e.message;
        });
      return { data };
    } catch (error) {
      return { error };
    }
  },
  update: async (id, reqProperty, reqAmenities) => {
    try {
      await db.transaction(async (transaction) => {
        await Property.update(reqProperty, {
          where: { id },
          transaction,
        })
          .then((res) => res)
          .catch((e) => {
            throw e.message;
          });

        await Amenities.update(reqAmenities, {
          where: { propertyId: id },
          transaction,
        }).catch((e) => {
          throw e.message;
        });
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  remove: async (id) => {
    try {
      await db.transaction(async (transaction) => {
        await Property.destroy({ where: { id } }, transaction);
        await Amenities.destroy({ where: { propertyId: id }, transaction });
      });

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
