const Users = require("../../models/user.model");

module.exports = {
  create: async (req) => {
    try {
      await Users.create(req).catch((err) => {
        throw err.message;
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  findByEmail: async (email) => {
    try {
      const data = await Users.findOne({ where: { email } })
        .then((res) => res.toJSON())
        .catch((err) => {
          throw err.message;
        });
      return { data };
    } catch (error) {
      return { error };
    }
  },
  update: async (id, req) => {
    try {
      await Users.update(req, { where: { id } }).catch((err) => {
        throw err.message;
      });
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};
