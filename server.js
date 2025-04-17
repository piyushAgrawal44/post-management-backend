import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorMiddleWare.js";
import userRouter from "./routes/UserRoutes.js";
import postsRouter from "./routes/PostsRoutes.js";
import commentsRouter from "./routes/CommentsRoutes.js";

config({ path: "config/config.env" });
const app = express();
const port = process.env.PORT || 5000;
const MONGOURI = process.env.MONGOURI;

connectDB(MONGOURI);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/api", postsRouter);
app.use("/api", commentsRouter);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("server is working");
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is working on ${port}`);
});
