import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import PropertyModel from "./property";

export interface TypeOfRentAtributes {
  id: number;
  type: string;
  propertyId: number;
}

type TypeOfRentCreationAttributes = Optional<TypeOfRentAtributes, "id">;
interface TypeOfRentInstance extends Model<TypeOfRentAtributes, TypeOfRentCreationAttributes>, TypeOfRentAtributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const TypeOfRentModel = sequelize.define<TypeOfRentInstance>("typeOfRent", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  type: {
    allowNull: false,
    type: DataTypes.ENUM("day", "month", "year"),
  },
  propertyId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

PropertyModel.hasMany(TypeOfRentModel, { foreignKey: "propertyId" });
TypeOfRentModel.belongsTo(PropertyModel, { foreignKey: "propertyId" });

export default TypeOfRentModel;
