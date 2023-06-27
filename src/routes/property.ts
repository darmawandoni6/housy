import expres from "express";

import jwt from "@utils/jwt";

import propertyController from "@controllers/property.controller";

const propertyRouter = expres.Router();

propertyRouter
  .route("/property")
  .get(jwt.verifyAccessToken, propertyController.findAll)
  .post(jwt.verifyAccessToken, propertyController.create);
propertyRouter
  .route("/property/:id")
  .get(jwt.verifyAccessToken, propertyController.findById)
  .put(jwt.verifyAccessToken, propertyController.edit)
  .delete(jwt.verifyAccessToken, propertyController.remove);

export default propertyRouter;
