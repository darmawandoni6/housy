const { Sequelize } = require("sequelize");
const db = require("../configs/mysql");
const Booking = require("./booking.model");
const Property = require("./property.model");

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING(25),
    },
    email: {
      type: DataTypes.STRING(25),
    },
    password: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["married", "single"],
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["male", "female"],
    },
    phone: {
      type: DataTypes.STRING(13),
    },
    address: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);

Users.hasMany(Property);
Property.belongsTo(Users);

Users.hasMany(Booking, { foreignKey: { name: "buyerId", allowNull: false } });
Booking.belongsTo(Users, {
  foreignKey: { name: "buyerId", allowNull: false },
});

module.exports = Users;
