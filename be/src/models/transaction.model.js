const Sequelize = require("sequelize");
const database = require("../configs/mysql");

const { DataTypes } = Sequelize;

const Transaction = database.define(
  "transactions",
  {
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "cancel", "approve"],
      defaultValue: "pending",
    },
  },
  { freezeTableName: true }
);

module.exports = Transaction;
