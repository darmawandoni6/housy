const db = require("../../configs/mysql");
const Booking = require("../../models/booking.model");
const Property = require("../../models/property.model");
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const { Op } = require("sequelize");

module.exports = {
  createBooking: async (req) => {
    try {
      await db.transaction(async (transaction) => {
        const data = await Booking.create(req, { transaction });
        await Transaction.create({ bookingId: data.id }, { transaction });

        await Property.update(
          { isStatus: "booking" },
          { where: { id: req.propertyId }, transaction }
        );
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  findProperty: async (where) => {
    try {
      const data = await Property.findOne({ where });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  find: async (buyerId, params) => {
    try {
      const { start, limit } = params;

      const data = await Booking.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ["name", "email", "gender", "phone"],
          },
        ],
        where: {
          [Op.and]: {
            buyerId,
            id: { [Op.gt]: start },
          },
        },
        limit,
      });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  findByid: async (where) => {
    try {
      const data = await Booking.findOne({ where });
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  cancelBooking: async (id, propertyId) => {
    try {
      await db.transaction(async (transaction) => {
        await Booking.update(
          { status: "Cancel" },
          { where: { id }, transaction }
        );
        await Transaction.update(
          { status: "cancel" },
          { where: { bookingId: id }, transaction }
        );
        await Property.update(
          { isStatus: "available" },
          { where: { id: propertyId }, transaction }
        );
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  paymentBooking: async (id, req) => {
    try {
      await Booking.update(req, { where: { id } });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
};
