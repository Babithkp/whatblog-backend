import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import curdRouter from "./router/user";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(curdRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});