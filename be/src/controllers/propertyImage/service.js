const PropertyImage = require("../../models/propertyImage.model");
const db = require("../../configs/mysql");

module.exports = {
  updateProperty: async (req) => {
    try {
      const data = await PropertyImage.create(req);
      return { data: data.toJSON() };
    } catch (error) {
      return { error: error.message };
    }
  },
};
