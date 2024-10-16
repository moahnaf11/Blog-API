import express, { urlencoded } from "express";
import "dotenv/config";
import { userRouter } from "./routes/userRouter.js";
import { postRouter } from "./routes/postsRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import cors from "cors";

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/posts/:id/comments", commentRouter);

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
