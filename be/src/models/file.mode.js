const { Sequelize } = require("sequelize");
const db = require("../configs/mysql");
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
  },
  { freezeTableName: true }
);

Files.hasOne(Users);
Users.belongsTo(Files);

module.exports = Files;
