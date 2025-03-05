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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllBlogs = exports.userLogin = exports.verifyUserOtp = exports.extentOtpExpiry = exports.createNewUser = exports.userLoginWithGoogle = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const randomstring_1 = __importDefault(require("randomstring"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const userLoginWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userName, image } = req.body;
    if (!email || !userName) {
        res.status(401).json({ message: "Please provide email and name" });
        return;
    }
    try {
        const isExistingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (isExistingUser) {
            const token = jsonwebtoken_1.default.sign({ userId: isExistingUser.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.status(201).json({ message: "User already exists", token });
            return;
        }
        const newUser = yield prisma.user.create({
            data: {
                email,
                name: userName,
                imageUrl: image || "",
                verfied: true,
                OTPExpiry: new Date(),
            },
        });
        if (newUser) {
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.status(200).json({ message: "Success", token });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong", error });
    }
});
exports.userLoginWithGoogle = userLoginWithGoogle;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email && !password) {
        res.status(401).json({ message: "Please provide email and password" });
        return;
    }
    const otp = randomstring_1.default.generate({
        length: 6,
        charset: "numeric",
    });
    try {
        const verfiedUser = yield prisma.user.findUnique({
            where: {
                email,
                verfied: true,
            },
        });
        if (verfiedUser) {
            res.status(201).json({ message: "user Already exist" });
            return;
        }
        const unverfiedUser = yield prisma.user.findUnique({
            where: {
                email,
                verfied: false,
            },
        });
        if (unverfiedUser) {
            yield prisma.user.update({
                where: {
                    id: unverfiedUser.id,
                },
                data: {
                    OTP: parseInt(otp),
                    OTPExpiry: new Date(Date.now() + 2 * 60 * 1000),
                },
            });
            const subject = `${otp} is your verification code`;
            yield (0, utils_1.sendVerificationEmail)(unverfiedUser.email, subject, (0, utils_1.userVerificationEmail)(otp.toString()));
            const token = jsonwebtoken_1.default.sign({ userId: unverfiedUser.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.status(200).json({ message: "user exist but not verified", token });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verfied: false,
                OTP: parseInt(otp),
                OTPExpiry: new Date(Date.now() + 2 * 60 * 1000),
            },
        });
        console.log(otp);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        const subject = `${otp} is your verification code`;
        yield (0, utils_1.sendVerificationEmail)(user.email, subject, (0, utils_1.userVerificationEmail)(otp.toString()));
        res.status(200).json({ message: "success", token });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "somthing went wrong", error });
    }
});
exports.createNewUser = createNewUser;
const extentOtpExpiry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body.userId;
    const otp = randomstring_1.default.generate({
        length: 6,
        charset: "numeric",
    });
    try {
        const user = yield prisma.user.update({
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
        yield (0, utils_1.sendVerificationEmail)(user.email, subject, (0, utils_1.userVerificationEmail)(otp.toString()));
        res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "somthing went wrong", error });
    }
});
exports.extentOtpExpiry = extentOtpExpiry;
const verifyUserOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body.userId;
    const { otp } = req.body;
    console.log(userId);
    if (!userId && otp === undefined) {
        res.status(401).json({ message: "Please provide userId and otp" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if ((user === null || user === void 0 ? void 0 : user.OTPExpiry) && (user === null || user === void 0 ? void 0 : user.OTPExpiry) > new Date()) {
            if (user.OTP === parseInt(otp)) {
                yield prisma.user.update({
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
        }
        else {
            res.status(204).json({ message: "OTP Expired" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "somthing went wrong", error });
    }
});
exports.verifyUserOtp = verifyUserOtp;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email && !password) {
        res.status(400).json({ message: "Please provide email and password" });
    }
    if (email === "admin@cadalu.com" && password === "cadalu@123") {
        res.status(202).json({ message: "admin login success" });
        return;
    }
    try {
        const isExist = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!isExist) {
            res.status(201).json({ message: "user does not exist" });
        }
        else {
            const user = yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if ((user === null || user === void 0 ? void 0 : user.password) === null) {
                res.status(203).json({ message: "Please Login with Google" });
                return;
            }
            if (user && user.password) {
                const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (isPasswordMatch) {
                    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
                    res.status(200).json({ message: "Success", token });
                }
                else {
                    res.status(202).json({ message: "Invalid password" });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "somthing went wrong", error });
    }
});
exports.userLogin = userLogin;
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
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
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body.userId;
    if (!userId) {
        res.status(400).json({ message: "Please provide User ID" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getUserById = getUserById;
