const Booking = require("../../models/booking.model");
const Property = require("../../models/property.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const File = require("../../models/file.model");
const Amenities = require("../../models/amenities.model");
const db = require("../../configs/mysql");

module.exports = {
  find: async (userId, params) => {
    try {
      let { page, limit } = params;
      const offset = page * limit - limit;
      const data = await Property.findAndCountAll({
        include: [
          {
            model: Booking,
            attributes: {
              exclude: ["createdAt", "updatedAt", "propertyId"],
            },
            include: [
              {
                model: Transaction,
              },
              {
                model: File,
              },
              {
                model: User,
                attributes: ["name", "email", "gender", "phone"],
              },
            ],
          },
          {
            model: Amenities,
            as: "amenities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "propertyId"],
            },
          },
        ],
        attributes: ["name", "address"],

        where: { userId },
        offset,
        limit,
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  findById: async (where) => {
    try {
      const data = await Transaction.findOne({
        attributes: ["id", "status"],
        include: [
          {
            model: Booking,
            attributes: ["id", "propertyId"],
          },
        ],
        where,
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  update: async (transaksi, booking, property) => {
    try {
      await db.transaction(async (transaction) => {
        await Transaction.update(transaksi.data, {
          where: { id: transaksi.id },
          transaction,
        });
        await Booking.update(booking.data, {
          where: { id: booking.id },
          transaction,
        });
        await Property.update(property.data, {
          where: { id: property.id },
          transaction,
        });
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
