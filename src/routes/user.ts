import expres from "express";

import jwt from "@utils/jwt";

import userController from "@controllers/user.controller";

const userRouter = expres.Router();

userRouter
  .route("/user")
  .put(jwt.verifyAccessTokenOwner, userController.update)
  .get(jwt.verifyAccessTokenOwner, userController.findByid);
userRouter.put("/user/change-password", jwt.verifyAccessTokenOwner, userController.changePassword);

export default userRouter;
