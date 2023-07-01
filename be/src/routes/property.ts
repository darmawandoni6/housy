import expres from "express";

import { verifyBasicAuth } from "@utils/basicAuth";
import jwt from "@utils/jwt";

import propertyController from "@controllers/property.controller";

const propertyRouter = expres.Router();

propertyRouter
  .route("/property")
  .get(jwt.verifyAccessTokenOwner, propertyController.findAll)
  .post(jwt.verifyAccessTokenOwner, propertyController.create);
propertyRouter
  .route("/property/:id")
  .get(jwt.verifyAccessTokenOwner, propertyController.findById)
  .put(jwt.verifyAccessTokenOwner, propertyController.edit)
  .delete(jwt.verifyAccessTokenOwner, propertyController.remove);

propertyRouter.get("/marketplace/property", verifyBasicAuth, propertyController.marketplaceAll);
propertyRouter.get("/marketplace/property/:id", verifyBasicAuth, propertyController.marketplaceById);

export default propertyRouter;
