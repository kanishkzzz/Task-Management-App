import { NextFunction, Request, Response } from "express";
import {
  loginUserService,
  refreshAuthTokenService,
  registerUserService,
} from "../services/auth.service";
import { HttpError } from "../middleware/error.middleware";
import { env } from "../config/env";

const authResponse = (
  message: string,
  payload: {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; email: string };
  }
) => ({
  success: true,
  message,
  data: payload,
});

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

const getCookieValue = (cookieHeader: string | undefined, name: string) => {
  if (!cookieHeader) {
    return undefined;
  }

  const cookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`));

  return cookie?.slice(name.length + 1);
};

const setAuthCookies = (res: Response, token: string, refreshToken: string) => {
  const sharedOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.nodeEnv === "production",
  };

  res.cookie("token", token, {
    ...sharedOptions,
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...sharedOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

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

  setAuthCookies(res, result.token, result.refreshToken);

  return res
    .status(201)
    .json(authResponse("User registered successfully", {
      accessToken: result.token,
      refreshToken: result.refreshToken,
      user: result.user,
    }));
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

  setAuthCookies(res, result.token, result.refreshToken);

  return res.status(200).json(authResponse("Login successful", {
    accessToken: result.token,
    refreshToken: result.refreshToken,
    user: result.user,
  }));
};

export const refreshToken = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const refreshTokenFromBody =
    typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined;
  const refreshTokenCookie = getCookieValue(req.headers.cookie, "refreshToken");
  const refreshTokenValue = refreshTokenFromBody ?? refreshTokenCookie;

  if (!refreshTokenValue) {
    throw new HttpError(401, "refresh token is required");
  }

  const result = await refreshAuthTokenService(refreshTokenValue);

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken: result.token,
    },
  });
};
