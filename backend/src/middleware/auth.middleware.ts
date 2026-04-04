import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
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

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    return authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const userId = decoded.userId;

    if (typeof userId !== "string") {
      return next(new HttpError(401, "Invalid token payload"));
    }

    req.user = { userId };

    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return next(new HttpError(401, "Invalid token"));
    }

    return next(error);
  }
};
