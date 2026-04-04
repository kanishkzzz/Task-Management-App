import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import taskRoutes from "./routes/task.route";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";

const app = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: (req as any).user,
  });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
