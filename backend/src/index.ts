import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.route";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";

dotenv.config();

import { env } from "./config/env";

const app = express();

app.disable("x-powered-by");
app.use((_, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: (origin, callback) => {
  if (!origin) return callback(null, true);

  const allowed = env.clientUrls.some(url => {
    try {
      const allowedHost = new URL(url).hostname;
      const incomingHost = new URL(origin).hostname;
      return allowedHost === incomingHost;
    } catch {
      return false;
    }
  });

  if (allowed) return callback(null, true);

  callback(new Error(`Origin ${origin} not allowed by CORS`));
},
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
