import expres from "express";

import jwt from "@utils/jwt";

import imageFileController from "@controllers/imageFile.controller";

const imageFileRouter = expres.Router();

imageFileRouter.post("/upload", jwt.verifyAccessTokenOwner, imageFileController.uploadFile);
imageFileRouter.get("/:id", imageFileController.readFile);
export default imageFileRouter;
