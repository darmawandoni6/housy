const Sequelize = require("sequelize");
const database = require("../configs/mysql");
const Amenities = require("./amenities.model");
const Booking = require("./booking.model");
const PropertyImage = require("./propertyImage.model");

const { DataTypes } = Sequelize;

const Property = database.define(
  "properties",
  {
    name: {
      type: DataTypes.STRING(25),
    },
    city: {
      type: DataTypes.STRING(100),
    },
    address: {
      type: DataTypes.TEXT,
    },
    pricePerDay: {
      type: DataTypes.FLOAT,
    },
    pricePerMonth: {
      type: DataTypes.FLOAT,
    },
    pricePerYear: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    bedroom: {
      type: DataTypes.INTEGER,
    },
    bathroom: {
      type: DataTypes.INTEGER,
    },
    area: {
      type: DataTypes.INTEGER,
    },
    isStatus: {
      type: DataTypes.ENUM,
      values: ["booking", "sold", "available"],
      defaultValue: "available",
    },
  },
  { freezeTableName: true }
);

Property.hasOne(Amenities, {
  foreignKey: {
    name: "propertyId",
    allowNull: false,
  },
  as: "amenities",
});
Amenities.belongsTo(Property, {
  foreignKey: {
    name: "propertyId",
    allowNull: false,
  },
  as: "amenities",
});

Property.hasMany(PropertyImage, {
  foreignKey: {
    name: "propertyId",
    allowNull: false,
  },
  as: "images",
});
PropertyImage.belongsTo(Property, { foreignKey: { allowNull: false } });

Property.hasOne(Booking, { foreignKey: { allowNull: false } });
Booking.belongsTo(Property, { foreignKey: { allowNull: false } });

module.exports = Property;
