import expres from "express";

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

export default propertyRouter;
