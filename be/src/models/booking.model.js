const Sequelize = require("sequelize");
const database = require("../configs/mysql");
const Transaction = require("./transaction.model");

const { DataTypes } = Sequelize;

const Booking = database.define(
  "booking",
  {
    status: {
      type: DataTypes.ENUM,
      values: ["Cancel", "Waiting Payment", "Waiting Approve", "Approve"],
      defaultValue: "Waiting Payment",
      allowNull: false,
    },
    typeOfRent: {
      type: DataTypes.ENUM,
      values: ["DAY", "MONTH", "YEAR"],
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalBooking: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    invoice: {
      type: DataTypes.STRING(10),
    },
  },
  { freezeTableName: true }
);

Booking.hasOne(Transaction, { foreignKey: { allowNull: false } });
Transaction.belongsTo(Booking, { foreignKey: { allowNull: false } });

module.exports = Booking;
