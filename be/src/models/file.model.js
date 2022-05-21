const { Sequelize } = require("sequelize");
const db = require("../configs/mysql");
const Booking = require("./booking.model");
const Users = require("./user.model");
const { DataTypes } = Sequelize;

const Files = db.define(
  "files",
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
    },
  },
  { freezeTableName: true }
);

Files.hasOne(Users);
Users.belongsTo(Files);

Files.hasOne(Booking);
Booking.belongsTo(Files);

module.exports = Files;
