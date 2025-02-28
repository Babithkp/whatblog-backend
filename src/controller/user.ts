import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, userVerificationEmail } from "../utils";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const userLoginWithGoogle = async (req: Request, res: Response) => {
  const { email, userName, image } = req.body;

  if (!email || !userName) {
    res.status(401).json({ message: "Please provide email and name" });
    return;
  }

  try {
    const isExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      const token = jwt.sign(
        { userId: isExistingUser.id },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.status(201).json({ message: "User already exists", token });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: userName,
        imageUrl: image || "",
        verfied: true,
        OTPExpiry: new Date(),
      },
    });

    if (newUser) {
      const token = jwt.sign(
        { userId: newUser.id },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.status(200).json({ message: "Success", token });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something went wrong", error });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(401).json({ message: "Please provide email and password" });
    return;
  }
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  try {
    const verfiedUser = await prisma.user.findUnique({
      where: {
        email,
        verfied: true,
      },
    });
    if (verfiedUser) {
      res.status(201).json({ message: "user Already exist" });
      return;
    }
    const unverfiedUser = await prisma.user.findUnique({
      where: {
        email,
        verfied: false,
      },
    });
    if (unverfiedUser) {
      await prisma.user.update({
        where: {
          id: unverfiedUser.id,
        },
        data: {
          OTP: parseInt(otp),
          OTPExpiry: new Date(Date.now() + 2 * 60 * 1000),
        },
      });
      const subject = `${otp} is your verification code`;
      await sendVerificationEmail(
        unverfiedUser.email,
        subject,
        userVerificationEmail(otp.toString())
      );
      const token = jwt.sign(
        { userId: unverfiedUser.id },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.status(200).json({ message: "user exist but not verified", token });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verfied: false,
        OTP: parseInt(otp),
        OTPExpiry: new Date(Date.now() + 2 * 60 * 1000),
      },
    });
    console.log(otp);

    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    const subject = `${otp} is your verification code`;
    await sendVerificationEmail(
      user.email,
      subject,
      userVerificationEmail(otp.toString())
    );
    res.status(200).json({ message: "success", token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "somthing went wrong", error });
  }
};

export const extentOtpExpiry = async (req: Request, res: Response) => {
  const { userId } = req.body.userId;
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        OTP: parseInt(otp),
        OTPExpiry: new Date(Date.now() + 2 * 60 * 1000),
      },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const subject = `${otp} is your verification code`;
    await sendVerificationEmail(
      user.email,
      subject,
      userVerificationEmail(otp.toString())
    );
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "somthing went wrong", error });
  }
};

export const verifyUserOtp = async (req: Request, res: Response) => {
  const { userId } = req.body.userId;
  const { otp } = req.body;
  console.log(userId);

  if (!userId && otp === undefined) {
    res.status(401).json({ message: "Please provide userId and otp" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user?.OTPExpiry && user?.OTPExpiry > new Date()) {
      if (user.OTP === parseInt(otp)) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            verfied: true,
          },
        });
        res.status(200).json({ message: "success" });
        return;
      }
      res.status(204).json({ message: "OTP Expired" });
    } else {
      res.status(204).json({ message: "OTP Expired" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "somthing went wrong", error });
  }
};


export const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email && !password) {
      res.status(400).json({ message: "Please provide email and password" });
    }
    try {
      const isExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
  
      if (!isExist) {
        res.status(201).json({ message: "user does not exist" });
      } else {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (user?.password === null) {
          res.status(203).json({ message: "Please Login with Google" });
          return;
        }
        if (user && user.password) {
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatch) {
            const token = jwt.sign(
              { userId: user.id },
              process.env.SECRET_KEY as string,
              { expiresIn: "1d" }
            );
            res.status(200).json({ message: "Success", token });
          } else {
            res.status(202).json({ message: "Invalid password" });
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "somthing went wrong", error });
    }
  };

export const gerUserById = async (req: Request, res: Response) => {
  const { userId } = req.body.userId;
  if(!userId){
    res.status(400).json({ message: "Please provide User ID" });
    return
  }
  try {
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};