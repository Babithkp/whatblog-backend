import { Router } from "express";
import { imageUploadToS3 } from "../controller/uploadImage";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const uploadRouter = Router();

uploadRouter.post("/api/uploadImage", upload.single("file"), imageUploadToS3);

export default uploadRouter;