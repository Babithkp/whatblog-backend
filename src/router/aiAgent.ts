import { Router } from "express";

import { blogClassifier } from "../controller/aiAgent";
const aiAgentRouter = Router();

aiAgentRouter.post("/api/aiAgent/blogClassifier", blogClassifier);

export default aiAgentRouter;