const Sequelize = require("sequelize");
const database = require("../configs/mysql");

const { DataTypes } = Sequelize;

const Amenities = database.define(
  "amenities",
  {
    furnished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    petAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sharedAccommodation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Amenities;
