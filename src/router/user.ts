import { Router } from "express";
import {
  createNewUser,
  gerUserById,
  userLogin,
  userLoginWithGoogle,
  verifyUserOtp,
} from "../controller/user";
import { authMiddleware } from "../middleware/auth";

const userRouter = Router();

userRouter.post("/api/user/signupWithEmail", createNewUser);
userRouter.post("/api/user/signupWithGoogle", userLoginWithGoogle);
userRouter.post("/api/user/userLogin", userLogin);
userRouter.post("/api/user/verifyOtp", authMiddleware, verifyUserOtp);
userRouter.get("/api/user", authMiddleware, gerUserById);

export default userRouter;
