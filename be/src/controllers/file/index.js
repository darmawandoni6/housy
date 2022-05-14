const formidable = require("formidable");
const httpError = require("http-errors");
const response = require("../../helpers/response");
const { createProfile } = require("./service");

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
};
