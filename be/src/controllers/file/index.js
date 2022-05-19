const formidable = require("formidable");
const httpError = require("http-errors");
const response = require("../../helpers/response");
const { findByid } = require("../booking/service");
const { createProfile, updateBuktiPayment } = require("./service");

const handleRollback = (name, option) => {
  const { path, files } = option;
  const { err } = rollbackFile(path + "/" + files[name].newFilename);
  if (err) return httpError.BadRequest(err);
};

module.exports = {
  uploadFile: async (req, res, next) => {
    try {
      const path = "./public/profile";
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        uploadDir: path,
        maxFileSize: 10485760,
      });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return next(httpError(err.httpCode, err.message));
        }

        if (Object.entries(files).length > 1)
          return next(createHttpError.BadRequest("variable image only 1"));

        let fileImage = {};
        let nameFormData;
        if (files["profile"]) {
          nameFormData = "profile";
          fileImage = await files["profile"];
        } else {
          return next(createHttpError.NotFound("variable image not found"));
        }
        const { newFilename, mimetype } = fileImage;
        const { data, error } = await createProfile({
          name: newFilename,
          type: mimetype,
          folder: nameFormData,
        });
        if (error) {
          const err = await handleRollback(nameFormData, { path, files });
          if (err) return next(err);
          return next(httpError.BadRequest(error));
        }
        return res.status(200).json(
          response.success({
            message: "ubah password success",
            data: {
              id: data.id,
              fileUrl: process.env.BASE_URL + "/profile/" + newFilename,
            },
          })
        );
      });
    } catch (error) {
      next(error);
    }
  },
  uploadFileBooking: async (req, res, next) => {
    try {
      const { id } = req.params;

      let booking = { data: null, error: null };
      booking = await findByid({ id, status: "Waiting Payment" });
      if (booking.error) throw httpError.BadRequest(booking.error);

      const path = "./public/booking";
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        uploadDir: path,
        maxFileSize: 10485760,
      });

      await form.parse(req, async (err, fields, files) => {
        if (err) {
          return next(httpError(err.httpCode, err.message));
        }

        if (Object.entries(files).length > 1)
          return next(createHttpError.BadRequest("variable image only 1"));

        let fileImage = {};
        let nameFormData;
        if (files["booking"]) {
          nameFormData = "booking";
          fileImage = await files["booking"];
        } else {
          return next(createHttpError.NotFound("variable image not found"));
        }
        const { newFilename, mimetype } = fileImage;

        const { error } = await updateBuktiPayment(
          {
            name: newFilename,
            type: mimetype,
            folder: nameFormData,
          },
          booking.data
        );
        if (error) {
          const err = await handleRollback(nameFormData, { path, files });
          if (err) return next(err);
          return next(httpError.BadRequest(error));
        }
        return res.status(200).json(
          response.success({
            message: "upload bukti transaksi success",
          })
        );
      });
    } catch (error) {
      next(error);
    }
  },
};
