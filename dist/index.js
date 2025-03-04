"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./router/user"));
const body_parser_1 = __importDefault(require("body-parser"));
const uploadImage_1 = __importDefault(require("./router/uploadImage"));
const aiAgent_1 = __importDefault(require("./router/aiAgent"));
const admin_1 = __importDefault(require("./router/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(uploadImage_1.default);
app.use(user_1.default);
app.use(admin_1.default);
app.use(aiAgent_1.default);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
