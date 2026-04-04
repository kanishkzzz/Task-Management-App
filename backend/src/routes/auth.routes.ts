import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));

export default router;
