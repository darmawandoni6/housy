const File = require("../../models/file.mode");
const fs = require("fs");

module.exports = {
  createProfile: async (req) => {
    try {
      const data = await File.create(req)
        .then((res) => res.toJSON())
        .catch((err) => {
          throw err.message;
        });
      return { data };
    } catch (error) {
      return { error };
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
