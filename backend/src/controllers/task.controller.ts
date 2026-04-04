import { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user.userId;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await createTaskService(userId, {
      title,
      description,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
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
        return res
          .status(400)
          .json({ message: "status must be either true or false" });
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
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const taskId = Array.isArray(id) ? id[0] : id;

    if (!taskId) {
      return res.status(400).json({ message: "Task id is required" });
    }
    const { title, description, status } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      return res.status(400).json({ message: "No fields provided for update" });
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
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TASK_NOT_FOUND") {
        return res.status(404).json({ message: "Task not found" });
      }

      if (error.message === "TASK_FORBIDDEN") {
        return res
          .status(403)
          .json({ message: "You are not allowed to update this task" });
      }
    }

    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
