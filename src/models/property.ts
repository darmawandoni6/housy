import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import { PropertyImageAtributes } from "./propertyImage";
import UserModel from "./user";

export interface PropertyAtributes {
  id: number;
  name: string;
  address: string;
  bedroom: number;
  bathroom: number;
  area: number;
  description: string;
  userId: number;
}

type PropertyCreationAttributes = Optional<PropertyAtributes, "id">;
interface PropertyInstance extends Model<PropertyAtributes, PropertyCreationAttributes>, PropertyAtributes {
  propertyImages?: PropertyImageAtributes;
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertyModel = sequelize.define<PropertyInstance>("propertie", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  address: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  bedroom: {
    allowNull: false,
    type: DataTypes.NUMBER,
  },
  bathroom: {
    allowNull: false,
    type: DataTypes.NUMBER,
  },
  area: {
    allowNull: false,
    type: DataTypes.NUMBER,
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

UserModel.hasOne(PropertyModel, { foreignKey: "userId" });
PropertyModel.belongsTo(PropertyModel, { foreignKey: "userId" });

export default PropertyModel;
