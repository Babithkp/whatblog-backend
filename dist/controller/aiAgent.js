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
exports.blogClassifier = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const togetherai_1 = require("@langchain/community/chat_models/togetherai");
dotenv_1.default.config();
const filterResponse = (aiResponse, options) => {
    const filteredResponse = { "readTime": aiResponse["readTime"] };
    Object.keys(options).forEach((key) => {
        if (options[key] && aiResponse[key] !== undefined) {
            filteredResponse[key] = aiResponse[key];
        }
    });
    return filteredResponse;
};
const blogClassifier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, options } = req.body;
    const togetherApiKey = process.env.TOGETHER_AI_API_KEY;
    if (!togetherApiKey) {
        res.status(400).json({ message: "failed to get together ai key" });
        return;
    }
    const llm = new togetherai_1.ChatTogetherAI({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        apiKey: togetherApiKey,
    });
    try {
        const response = yield llm.invoke([
            [
                "system",
                `You are an AI assistant that generates content based on a given blog post. Additionally, you must create some the content and sentence length to calculate the estimated reading time.
        and don't generate all if "none" then output the Read time only in the following format:

        Respond **only** with valid JSON in the following format:

      {
        "introduction": "Your introduction text here.",
        "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
        "conclusion": "Your conclusion text here.",
        "readTime": "time in minutes"
      }

      `,
            ],
            ["human", content],
        ]);
        const jsonMatch = response === null || response === void 0 ? void 0 : response.content.toString().match(/```json([\s\S]*?)```/);
        const jsonContent = jsonMatch
            ? jsonMatch[1].trim()
            : response === null || response === void 0 ? void 0 : response.content.toString().trim();
        const jsonResponse = JSON.parse(jsonContent);
        const result = filterResponse(jsonResponse, options);
        res.status(200).json({
            message: "success",
            data: result,
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: "failed" });
    }
});
exports.blogClassifier = blogClassifier;
