const File = require("../../models/file.model");
const db = require("../../configs/mysql");
const fs = require("fs");
const Booking = require("../../models/booking.model");

module.exports = {
  createProfile: async (req) => {
    try {
      const data = await File.create(req);
      return { data: data.toJSON() };
    } catch (error) {
      return { error: error.message };
    }
  },
  updateBuktiPayment: async (file, booking) => {
    try {
      await db.transaction(async (transaction) => {
        const data = await File.create(file, { transaction });
        await Booking.update(
          { fileId: data.id },
          { where: { id: booking.id }, transaction }
        );
      });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
  rollbackFile: async (path) => {
    try {
      await fs.unlinkSync(path);
      return { err: null };
    } catch (err) {
      return { err };
    }
  },
};
