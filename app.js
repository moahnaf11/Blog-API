import express, { urlencoded } from "express";
import { userRouter } from "./routes/userRouter.js";
import { postRouter } from "./routes/postsRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import cors from "cors";

const app = express();

const allowedOrigin = "https://myblogshaven.netlify.app";

app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/posts/:id/comments", commentRouter);

export default app;

// app.listen(process.env.PORT, () =>
//   console.log(`listening on port ${process.env.PORT}`)
// );
