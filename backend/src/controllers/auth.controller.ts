import { NextFunction, Request, Response } from "express";
import { loginUserService, registerUserService } from "../services/auth.service";
import { HttpError } from "../middleware/error.middleware";

export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(400, "All fields are required");
  }

  const user = await registerUserService({ name, email, password });

  return res.status(201).json({ message: "User registered successfully", user });
};

export const loginUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and Password are required");
  }

  const result = await loginUserService({ email, password });

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login Successful",
    ...result,
  });
};
