import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import { RoleAtributes } from "./role";

export interface UserAttributes {
  id: number;
  username: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  address: string;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "gender" | "phone" | "address">;
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  roles?: RoleAtributes;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserModel = sequelize.define<UserInstance>("user", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fullName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
});

export default UserModel;
