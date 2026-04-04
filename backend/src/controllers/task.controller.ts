import { NextFunction, Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service";
import { HttpError } from "../middleware/error.middleware";

export const createTask = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { title, description } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!title) {
    throw new HttpError(400, "Title is required");
  }

  const task = await createTaskService(userId, {
    title,
    description,
  });

  return res.status(201).json({
    message: "Task created successfully",
    task,
  });
};

export const getTasks = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const statusQuery = req.query.status;
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : undefined;

  let status: boolean | undefined;
  if (typeof statusQuery === "string") {
    if (statusQuery.toLowerCase() === "true") {
      status = true;
    } else if (statusQuery.toLowerCase() === "false") {
      status = false;
    } else {
      throw new HttpError(400, "status must be either true or false");
    }
  }

  const result = await getTasksService({
    userId,
    page,
    limit,
    ...(status !== undefined ? { status } : {}),
    ...(search ? { search } : {}),
  });

  return res.status(200).json({
    message: "Tasks fetched successfully",
    data: {
      tasks: result.tasks,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    },
  });
};

export const updateTask = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const taskId = Array.isArray(id) ? id[0] : id;

  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!taskId) {
    throw new HttpError(400, "Task id is required");
  }

  const { title, description, status } = req.body;

  if (title === undefined && description === undefined && status === undefined) {
    throw new HttpError(400, "No fields provided for update");
  }

  const task = await updateTaskService(taskId, userId, {
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(status !== undefined ? { status } : {}),
  });

  return res.status(200).json({
    message: "Task updated successfully",
    task,
  });
};
