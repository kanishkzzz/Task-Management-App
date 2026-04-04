import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTask, updateTask } from "../controllers/task.controller";

const router = Router();

router.post("/", authMiddleware, createTask);
router.patch("/:id", authMiddleware, updateTask);

export default router;
