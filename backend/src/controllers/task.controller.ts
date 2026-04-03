import { Request, Response } from "express";
import { createTaskService } from "../services/task.service";

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description} = req.body;
        const userId = (req as any).user.userId;

        if(!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const task = await createTaskService(userId, {
        title,
        description,
    });

    return res.status(201).json({
        message: "Task created successfully",
        task,
    })
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

