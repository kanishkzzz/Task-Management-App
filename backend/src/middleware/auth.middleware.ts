import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { HttpError } from "./error.middleware";

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

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = getTokenFromCookie(req.headers.cookie);

    if (!authHeader && !cookieToken) {
      return next(new HttpError(401, "No token provided"));
    }

    const token = authHeader
      ? authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader
      : cookieToken;

    if (!token) {
      return next(new HttpError(401, "Invalid authorization header"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    (req as any).user = decoded;
    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new HttpError(401, "Invalid token"));
    }

    return next(error);
  }
};
