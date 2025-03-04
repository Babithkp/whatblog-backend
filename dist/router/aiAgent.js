"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiAgent_1 = require("../controller/aiAgent");
const aiAgentRouter = (0, express_1.Router)();
aiAgentRouter.post("/api/aiAgent/blogClassifier", aiAgent_1.blogClassifier);
exports.default = aiAgentRouter;
