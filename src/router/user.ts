import { Router } from "express";
import {
  createNewUser,
  getAllBlogs,
  getBlogsByQuery,
  getUserById,
  userLogin,
  userLoginWithGoogle,
  verifyUserOtp,
} from "../controller/user";
import { authMiddleware } from "../middleware/auth";
import { getBlogById } from "../controller/admin";

const userRouter = Router();

userRouter.post("/api/user/signupWithEmail", createNewUser);
userRouter.post("/api/user/signupWithGoogle", userLoginWithGoogle);
userRouter.post("/api/user/userLogin", userLogin);
userRouter.post("/api/user/verifyOtp", authMiddleware, verifyUserOtp);
userRouter.get("/api/user", authMiddleware, getUserById);
userRouter.get("/api/user/getBlogById/:id", getBlogById);
userRouter.get("/api/user/getAllBlogs", getAllBlogs);
userRouter.get("/api/user/getBlogsByQuery/:query", getBlogsByQuery);

export default userRouter;
