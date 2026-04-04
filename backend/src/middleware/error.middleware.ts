import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

const mapKnownError = (error: Error) => {
  switch (error.message) {
    case "INVALID_CREDENTIALS":
      return new HttpError(401, "Invalid email or Password");
    case "TASK_FORBIDDEN":
      return new HttpError(403, "You are not allowed to update this task");
    case "TASK_NOT_FOUND":
      return new HttpError(404, "Task not found");
    case "User already exists":
      return new HttpError(400, "User already exists");
    default:
      return undefined;
  }
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const normalizedError =
    error instanceof HttpError
      ? error
      : error instanceof Error
      ? mapKnownError(error) ?? new HttpError(500, "Internal Server Error")
      : new HttpError(500, "Internal Server Error");

  if (normalizedError.statusCode >= 500) {
    console.error("Unhandled server error:", error);
  }

  return res.status(normalizedError.statusCode).json({
    message: normalizedError.message,
  });
};

export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new HttpError(404, "Route not found"));
};
