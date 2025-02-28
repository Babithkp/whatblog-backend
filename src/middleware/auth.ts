import { NextFunction, Request, Response } from "express";import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = jwt.verify(token, process.env.SECRET_KEY as string);

    req.body.userId = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Unauthorized: Invalid Token" });
    return;
  }
};