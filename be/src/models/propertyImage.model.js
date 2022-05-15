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
    folder: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "/property",
    },
  },
  { freezeTableName: true }
);

module.exports = PropertyImage;
