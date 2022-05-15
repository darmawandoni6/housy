const httpError = require("http-errors");
const response = require("../../helpers/response");
const formidable = require("formidable");
const { findByid } = require("../property/service");
const { updateProperty } = require("./service");

const handleRollback = (name, option) => {
  const { path, files } = option;
  const { err } = rollbackFile(path + "/" + files[name].newFilename);
  if (err) return httpError.BadRequest(err);
};

module.exports = {
  uploadProperty: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.payload;

      const path = "./public/property";
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
          return next(httpError.BadRequest("variable image only 1"));

        let fileImage = {};
        let nameFormData;
        if (files["property"]) {
          nameFormData = "property";
          fileImage = await files["property"];
        } else {
          return next(httpError.NotFound("variable image not found"));
        }
        let property = { data: null, error: null };

        property = await findByid({ id, userId, isStatus: "available" });
        if (property.error) return next(httpError.BadRequest(property.error));
        if (!property.data)
          return next(httpError.NotFound("property tidak ada"));
        const { newFilename, mimetype } = fileImage;
        property = await updateProperty({
          name: newFilename,
          type: mimetype,
          propertyId: property.data.id,
        });
        if (property.error) {
          const err = await handleRollback(nameFormData, { path, files });
          if (err) return next(err);
          return next(httpError.BadRequest(property.error));
        }

        return res.status(200).json(
          response.success({
            message: "upload image property success",
            data: {
              id: property.data.id,
              fileUrl: process.env.BASE_URL + "/property/" + newFilename,
            },
          })
        );
      });
    } catch (error) {
      next(error);
    }
  },
};
