import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTask, getTasks, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.patch("/:id", authMiddleware, updateTask);

export default router;
