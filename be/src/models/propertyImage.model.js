const Sequelize = require("sequelize");
const database = require("../configs/mysql");

const { DataTypes } = Sequelize;

const PropertyImage = database.define(
  "property_images",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = PropertyImage;
