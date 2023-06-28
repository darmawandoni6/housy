import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import UserModel from "./user";

export enum Role {
  owner,
  buyer,
}
export interface RoleAtributes {
  id: number;
  name: Role;
  status: boolean;
  userId: number;
}

type RoleCreationAttributes = Optional<RoleAtributes, "id">;
interface RoleInstance extends Model<RoleAtributes, RoleCreationAttributes>, RoleAtributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const RoleModel = sequelize.define<RoleInstance>("role", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: ["owner", "buyer"],
  },
  status: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

UserModel.hasMany(RoleModel, { foreignKey: "userId" });
RoleModel.belongsTo(UserModel, { foreignKey: "userId" });

export default RoleModel;
