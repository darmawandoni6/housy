import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import PropertyModel from "./property";

export interface AmenityAtributes {
  id: number;
  furnished: boolean;
  petAllowed: boolean;
  sharedAccomodation: boolean;
  propertyId: number;
}

type AmenityCreationAttributes = Optional<AmenityAtributes, "id">;
interface AmenityInstance extends Model<AmenityAtributes, AmenityCreationAttributes>, AmenityAtributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const AmenityModel = sequelize.define<AmenityInstance>("amenitie", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  furnished: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  petAllowed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sharedAccomodation: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  propertyId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

PropertyModel.hasOne(AmenityModel, {
  foreignKey: "propertyId",
});
AmenityModel.belongsTo(PropertyModel, {
  foreignKey: "propertyId",
});

export default AmenityModel;
