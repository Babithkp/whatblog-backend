"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogById = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image, imageDesc, introduction, keyTakeaways, conclusion, readTime, } = req.body;
    if (!title || !content || !readTime) {
        res.status(400).json({ message: "Please provide title and content" });
        return;
    }
    try {
        yield prisma.blog.create({
            data: {
                title,
                content,
                image,
                imageDesc,
                introduction,
                keyTakeaways,
                conclusion,
                readTime,
            },
        });
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.createBlog = createBlog;
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma.blog.findMany();
        if (!blogs) {
            res.status(202).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(blogs);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Please provide id" });
        return;
    }
    try {
        const blog = yield prisma.blog.findUnique({
            where: {
                id,
            },
        });
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(blog);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.getBlogById = getBlogById;
const deleteBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Please provide id" });
        return;
    }
    try {
        const blog = yield prisma.blog.delete({
            where: {
                id,
            },
        });
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(blog);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.deleteBlogById = deleteBlogById;
