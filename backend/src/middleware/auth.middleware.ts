import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { HttpError } from "./error.middleware";
import { env } from "../config/env";

const getTokenFromCookie = (cookieHeader?: string) => {
  if (!cookieHeader) {
    return undefined;
  }

  const tokenCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="));

  return tokenCookie?.split("=")[1];
};

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    if (!authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Malformed authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError(401, "Token is required");
    }

    return token;
  }

  return getTokenFromCookie(req.headers.cookie);
};

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return next(new HttpError(401, "No token provided"));
    }

    const decoded = jwt.verify(token, env.jwtSecret, {
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }) as JwtPayload;

    const userId = decoded.userId;

    if (typeof userId !== "string") {
      return next(new HttpError(401, "Invalid token payload"));
    }

    req.user = { userId };

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new HttpError(401, "Token expired"));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new HttpError(401, "Invalid token"));
    }

    return next(error);
  }
};
