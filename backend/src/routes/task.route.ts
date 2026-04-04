import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTask, getTasks, updateTask } from "../controllers/task.controller";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post("/", authMiddleware, asyncHandler(createTask));
router.get("/", authMiddleware, asyncHandler(getTasks));
router.patch("/:id", authMiddleware, asyncHandler(updateTask));

export default router;
