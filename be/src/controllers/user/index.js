const httpError = require("http-errors");
const { create, findByEmail, update } = require("./service");
const response = require("../../helpers/response");
const { encrypt, compare } = require("../../helpers/bcrypt");
const { signToken } = require("../../helpers/jwt");
const moment = require("moment");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data, error: errFind } = await findByEmail(email);
      if (errFind) throw httpError.BadRequest(errFind);
      if (data) throw httpError.Conflict("email sudah terdaftar");

      if (!password) throw httpError.BadRequest("password required");
      const reqUser = {
        ...req.body,
        password: encrypt(password),
      };
      const { error } = await create(reqUser);
      if (error) throw httpError.BadRequest(error);

      return res
        .status(200)
        .json(response.success({ message: "register success" }));
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      let { data, error } = await findByEmail(email);
      if (error) throw httpError.BadRequest(error);
      if (!data) throw httpError.BadRequest("email dan password tidak ada");

      const match = compare(password, data.password);
      if (!match) throw httpError.BadRequest("email dan password tidak ada");

      data = data.toJSON();
      delete data.password;
      const token = signToken(data);

      return res.status(200).json(
        response.success({
          data: {
            token,
            expired: moment().add(process.env.EXP_TOKEN, "d"),
          },
        })
      );
    } catch (error) {
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { id, email } = req.payload;

      const emailNotfound = httpError.NotFound("email dan password tidak ada");
      let { data, error } = await findByEmail(email);
      if (error) throw httpError.BadRequest(error);
      if (!data) throw emailNotfound;

      const checkOldPassword = compare(oldPassword, data.password);
      if (!checkOldPassword) throw emailNotfound;

      const hash = encrypt(newPassword);

      const user = {
        ...data,
        password: hash,
      };

      const { error: errUpdate } = update(id, user);
      if (errUpdate) throw httpError.BadRequest(errUpdate);

      return res.status(200).json(
        response.success({
          message: "ubah password success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { password } = req.body;
      const { id, email } = req.payload;

      const emailNotfound = httpError.NotFound("email dan password tidak ada");
      const { data, error } = await findByEmail(email);
      if (error) throw httpError.BadRequest(error);
      if (!data) throw emailNotfound;

      const user = {
        ...req.body,
        password: password ? encrypt(password) : data.password,
      };

      const { error: errUpdate } = await update(id, user);
      if (errUpdate) throw httpError.BadRequest(errUpdate);

      return res.status(200).json(
        response.success({
          message: "ubah password success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};
