import { NextFunction, Request, Response } from "express";
import { loginUserService, registerUserService } from "../services/auth.service";
import { HttpError } from "../middleware/error.middleware";

const authResponse = (
  message: string,
  payload: { token: string; user: { id: string; name: string; email: string } }
) => ({
  success: true,
  message,
  data: payload,
});

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new HttpError(400, "name, email and password are required");
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    throw new HttpError(400, "name must be between 2 and 100 characters");
  }

  if (!isValidEmail(normalizedEmail)) {
    throw new HttpError(400, "email is invalid");
  }

  if (password.length < 8 || password.length > 72) {
    throw new HttpError(400, "password must be between 8 and 72 characters");
  }

  const result = await registerUserService({
    name: normalizedName,
    email: normalizedEmail,
    password,
  });

  return res
    .status(201)
    .json(authResponse("User registered successfully", result));
};

export const loginUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    throw new HttpError(400, "email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new HttpError(400, "email is invalid");
  }

  if (password.length < 8 || password.length > 72) {
    throw new HttpError(400, "password is invalid");
  }

  const result = await loginUserService({ email: normalizedEmail, password });

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json(authResponse("Login successful", result));
};
