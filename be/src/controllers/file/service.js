const File = require("../../models/file.mode");
const fs = require("fs");

module.exports = {
  createProfile: async (req) => {
    try {
      const data = await File.create(req);
      return { data: data.toJSON() };
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
