import { PrismaClient } from "@prisma/client";import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createBlog = async (req: Request, res: Response) => {
  const {
    title,
    content,
    image,
    imageDesc,
    introduction,
    keyTakeaways,
    conclusion,
    readTime,
  } = req.body;
  if (!title || !content || !readTime) {
    res.status(400).json({ message: "Please provide title and content" });
    return;
  }
  try {
    await prisma.blog.create({
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
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", error });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany();
    if (!blogs) {
      res.status(202).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", error });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Please provide id" });
    return;
  }
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },
    });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", error });
  }
};

export const deleteBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Please provide id" });
    return;
  }
  try {
    const blog = await prisma.blog.delete({
      where: {
        id,
      },
    });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", error });
  }
};