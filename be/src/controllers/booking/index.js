const httpError = require("http-errors");
const moment = require("moment");
const response = require("../../helpers/response");
const {
  createBooking,
  findProperty,
  find,
  findByid,
  cancelBooking,
  paymentBooking,
} = require("./service");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { typeOfRent, checkIn, totalBooking, propertyId } = req.body;
      const { id: buyerId } = req.payload;

      if (new Date() > new Date(checkIn))
        throw httpError.BadRequest(
          "tanggal checkin harus lebih besar dari tanggal hari ini ...."
        );

      const whereProperty = { id: propertyId, isStatus: "available" };
      const property = await findProperty(whereProperty);
      if (property.error) throw httpError.BadRequest(error);
      if (!property.data) throw httpError.NotFound("property tidak ada");

      let checkOut = moment(checkIn)
        .add(totalBooking, typeOfRent)
        .format("YYYY-MM-DD");

      const booking = {
        ...req.body,
        buyerId,
        checkOut,
      };

      const { error } = await createBooking(booking);
      if (error) throw httpError.BadRequest(error);

      return res.status(200).json(
        response.success({
          message: "booking property success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  find: async (req, res, next) => {
    try {
      const { id } = req.payload;
      let { start, limit } = req.query;

      if (limit) limit = parseInt(limit);
      else limit = 10;

      if (start) start = parseInt(start);
      else start = 0;

      const { data, error } = await find(id, { start, limit });
      if (error) throw httpError.BadRequest(error);

      const { rows, count } = data;

      return res.status(200).json(
        response.success({
          data: {
            count,
            booking: rows,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  },
  cancelBooking: async (req, res, next) => {
    try {
      const { id } = req.params;

      let cancel = { data: null, error: null };
      cancel = await findByid({ id, status: "Waiting Payment" });
      if (cancel.error) throw httpError.BadRequest(cancel.error);
      if (!cancel.data)
        throw httpError.BadRequest("id booking tidak ditemukan");

      cancel = await cancelBooking(id, cancel.data.propertyId);
      if (cancel.error) throw httpError.BadRequest(cancel.error);

      return res.status(200).json(
        response.success({
          message: "cancel booking success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  paymentBooking: async (req, res, next) => {
    try {
      const { id } = req.params;

      let payment = { data: null, error: null };
      payment = await findByid({ id, status: "Waiting Payment" });
      if (payment.error) throw httpError.BadRequest(payment.error);
      if (!payment.data)
        throw httpError.BadRequest("id booking tidak ditemukan");

      payment = await paymentBooking(id, {
        status: "Waiting Approve",
        isPayment: true,
      });
      if (payment.error) throw httpError.BadRequest(payment.error);

      return res.status(200).json(
        response.success({
          message: "booking payment success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};
