import { Router } from "express";
import { createBlog, deleteBlogById, getAllBlogs, getBlogById } from "../controller/admin";

const adminRouter = Router();

adminRouter.post("/api/admin/createBlog", createBlog);
adminRouter.get("/api/admin/getAllBlogs", getAllBlogs);
adminRouter.get("/api/admin/getBlogById/:id", getBlogById);
adminRouter.delete("/api/admin/deleteBlogById/:id", deleteBlogById);

export default adminRouter;