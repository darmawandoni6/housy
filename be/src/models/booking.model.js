const Sequelize = require("sequelize");
const database = require("../configs/mysql");
const Transaction = require("./transaction.model");

const { DataTypes } = Sequelize;

const Booking = database.define(
  "booking",
  {
    status: {
      type: DataTypes.ENUM,
      values: ["Waiting Payment", "Waiting Approve", "Approve"],
    },
    TypeOfRent: {
      type: DataTypes.ENUM,
      values: ["DAY", "MONTH", "YEAR"],
    },
    checkIn: {
      type: DataTypes.STRING(50),
    },
    checkOut: {
      type: DataTypes.STRING(50),
    },
    isPayment: {
      type: DataTypes.BOOLEAN,
    },
    totalBooking: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
