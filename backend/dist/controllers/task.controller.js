"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.userId;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const task = await (0, task_service_1.createTaskService)(userId, {
            title,
            description,
        });
        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    }
    catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createTask = createTask;
//# sourceMappingURL=task.controller.js.map