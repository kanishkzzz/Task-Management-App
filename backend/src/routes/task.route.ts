import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "../controllers/task.controller";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post("/", authMiddleware, asyncHandler(createTask));
router.get("/", authMiddleware, asyncHandler(getTasks));
router.patch("/:id", authMiddleware, asyncHandler(updateTask));
router.patch("/:id/toggle", authMiddleware, asyncHandler(toggleTaskStatus));
router.delete("/:id", authMiddleware, asyncHandler(deleteTask));

export default router;
