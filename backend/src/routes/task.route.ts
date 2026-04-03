import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTask } from "../controllers/task.controller";

const router = Router();

router.post('/', authMiddleware, createTask);

export default router;