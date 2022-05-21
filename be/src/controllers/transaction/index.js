const httpError = require("http-errors");
const response = require("../../helpers/response");
const { find, findById, update } = require("./service");

module.exports = {
  find: async (req, res, next) => {
    try {
      const { id: userId } = req.payload;

      let { page, limit } = req.query;

      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 10;

      const { data, error } = await find(userId, { page, limit });
      if (error) throw httpError.BadRequest(error);

      const { rows, count } = data;
      const lastPage = count / limit;

      return res.status(200).json(
        response.success({
          data: rows,
          pagination: response.pagination({
            page,
            limit,
            count,
            lastPage: Math.ceil(lastPage),
          }),
        })
      );

      return res.status(200).json(
        response.success({
          message: "create property success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let statusTrans = { data: null, error: null };

      statusTrans = await findById({ id });
      if (statusTrans.error) throw httpError.BadRequest(statusTrans.error);
      if (!statusTrans.data) throw httpError.NotFound("transaksi tidak ada");
      if (
        statusTrans.data.status === "approve" ||
        statusTrans.data.status === "cancel"
      )
        throw httpError.BadRequest("Status Transaksi tidak bsa di ubah");

      let statusProperty;
      let statusBooking;

      if (status === "approve") {
        statusProperty = "sold";
        statusBooking = "Approve";
      } else if (status === "cancel") {
        statusProperty = "booking";
        statusBooking = "Cancel";
      } else {
        throw httpError.NotFound("value Status not found");
      }

      const transaksi = {
        status,
        updatedAt: Date.now(),
      };

      const property = {
        isStatus: statusProperty,
        updatedAt: Date.now(),
      };

      const booking = {
        status: statusBooking,
        updatedAt: Date.now(),
      };

      if (status === "approve")
        booking.invoice = `SN${statusTrans.data.booking.id}${Date.now()}`;

      statusTrans = await update(
        { id, data: transaksi },
        { id: statusTrans.data.booking.id, data: booking },
        { id: statusTrans.data.booking.propertyId, data: property }
      );
      if (statusTrans.error) throw httpError.BadRequest(statusTrans.error);

      return res.status(200).json(
        response.success({
          message: "update status success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};
