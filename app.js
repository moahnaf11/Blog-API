import express, { urlencoded } from "express";
import "dotenv/config";
import { userRouter } from "./routes/userRouter.js";
import { postRouter } from "./routes/postsRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
