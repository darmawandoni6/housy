import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@database/sequelize";

import ImageFileModel, { ImageFileAtributes } from "./imageFile";
import PropertyModel from "./property";

export interface PropertyImageAtributes {
  id: number;
  fileId: number;
  propertyId: number;
}

type PropertyImageCreationAttributes = Optional<PropertyImageAtributes, "id">;
interface PropertyImageInstance
  extends Model<PropertyImageAtributes, PropertyImageCreationAttributes>,
    PropertyImageAtributes {
  imageFile?: ImageFileAtributes;
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertyImageModel = sequelize.define<PropertyImageInstance>("propertyImage", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  fileId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  propertyId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
});

PropertyModel.hasMany(PropertyImageModel, { foreignKey: "propertyId" });
PropertyImageModel.belongsTo(PropertyModel, { foreignKey: "propertyId" });

ImageFileModel.hasOne(PropertyImageModel, { foreignKey: "fileId" });
PropertyImageModel.belongsTo(ImageFileModel, { foreignKey: "fileId" });

export default PropertyImageModel;
