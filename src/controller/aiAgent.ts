import dotenv from "dotenv";import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { Request, Response } from "express";
dotenv.config();

const filterResponse = (aiResponse: any, options: Record<string, boolean>) => {
  const filteredResponse: any = { "readTime": aiResponse["readTime"] };
  Object.keys(options).forEach((key) => {
    if (options[key] && aiResponse[key] !== undefined) {
      filteredResponse[key] = aiResponse[key];
    }
  });
  return filteredResponse;
};

export const blogClassifier = async (req: Request, res: Response) => {
  const { content, options } = req.body;

  const togetherApiKey = process.env.TOGETHER_AI_API_KEY;
  if (!togetherApiKey) {
    res.status(400).json({ message: "failed to get together ai key" });
    return;
  }

  const llm = new ChatTogetherAI({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    apiKey: togetherApiKey,
  });
  try {
    const response = await llm.invoke([
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

    const jsonMatch = response?.content
      .toString()
      .match(/```json([\s\S]*?)```/);
    const jsonContent = jsonMatch
      ? jsonMatch[1].trim()
      : response?.content.toString().trim();
    const jsonResponse = JSON.parse(jsonContent);
    const result = filterResponse(jsonResponse, options);

    res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "failed" });
  }
};
