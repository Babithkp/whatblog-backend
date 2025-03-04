import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./router/user";
import bodyParser from "body-parser";

import uploadRouter from "./router/uploadImage";
import aiAgentRouter from "./router/aiAgent";
import adminRouter from "./router/admin";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use(uploadRouter);

app.use(userRouter)
app.use(adminRouter)

app.use(aiAgentRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});