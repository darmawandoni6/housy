import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

export interface ImageFileAtributes {
  id: number;
  fileUrl: string;
  file: Buffer;
  type: string;
  status: boolean;
}

type ImageFileCreationAttributes = Optional<ImageFileAtributes, "id" | "status">;
interface ImageFileInstance extends Model<ImageFileAtributes, ImageFileCreationAttributes>, ImageFileAtributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const ImageFileModel = sequelize.define<ImageFileInstance>("imageFile", {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  fileUrl: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  file: {
    allowNull: false,
    type: DataTypes.BLOB("long"),
  },
  type: {
    allowNull: false,
    type: DataTypes.ENUM("profile", "property"),
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default ImageFileModel;
