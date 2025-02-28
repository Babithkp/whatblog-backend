import { Router } from "express";
import {
  createNewUser,
  gerUserById,
  userLogin,
  userLoginWithGoogle,
  verifyUserOtp,
} from "../controller/user";
import { authMiddleware } from "../middleware/auth";

const curdRouter = Router();

curdRouter.post("/api/user/signupWithEmail", createNewUser);
curdRouter.post("/api/user/signupWithGoogle", userLoginWithGoogle);
curdRouter.post("/api/user/userLogin", userLogin);
curdRouter.post("/api/user/verifyOtp", authMiddleware, verifyUserOtp);
curdRouter.get("/api/user", authMiddleware, gerUserById);

export default curdRouter;
