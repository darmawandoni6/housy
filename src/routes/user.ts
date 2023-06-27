import expres from "express";

import jwt from "@utils/jwt";

import userController from "@controllers/user.controller";

const userRouter = expres.Router();

userRouter
  .route("/user")
  .put(jwt.verifyAccessToken, userController.update)
  .get(jwt.verifyAccessToken, userController.findByid);
userRouter.put("/user/change-password", jwt.verifyAccessToken, userController.changePassword);

export default userRouter;
