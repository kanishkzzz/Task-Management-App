"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTaskStatusService = exports.deleteTaskService = exports.updateTaskService = exports.getTasksService = exports.createTaskService = void 0;
const prisma_1 = require("../lib/prisma");
const createTaskService = async (userId, data) => {
    return await prisma_1.Prisma.task.create({
        data: {
            title: data.title,
            userId,
            ...(data.description !== undefined ? { description: data.description } : {}),
        },
    });
};
exports.createTaskService = createTaskService;
const getTasksService = async ({ userId, page, limit, status, search, }) => {
    const whereClause = {
        userId,
        ...(status !== undefined ? { status } : {}),
        ...(search
            ? { title: { contains: search, mode: "insensitive" } }
            : {}),
    };
    const skip = (page - 1) * limit;
    const [tasks, total] = await prisma_1.Prisma.$transaction([
        prisma_1.Prisma.task.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.Prisma.task.count({
            where: whereClause,
        }),
    ]);
    const totalPages = Math.ceil(total / limit) || 1;
    return {
        tasks,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};
exports.getTasksService = getTasksService;
const updateTaskService = async (taskId, userId, data) => {
    const task = await prisma_1.Prisma.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new Error("TASK_NOT_FOUND");
    }
    if (task.userId !== userId) {
        throw new Error("TASK_FORBIDDEN");
    }
    return prisma_1.Prisma.task.update({
        where: { id: taskId },
        data,
    });
};
exports.updateTaskService = updateTaskService;
const deleteTaskService = async (taskId, userId) => {
    const task = await prisma_1.Prisma.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new Error("TASK_NOT_FOUND");
    }
    if (task.userId !== userId) {
        throw new Error("TASK_FORBIDDEN");
    }
    return prisma_1.Prisma.task.delete({
        where: { id: taskId },
    });
};
exports.deleteTaskService = deleteTaskService;
const toggleTaskStatusService = async (taskId, userId) => {
    const task = await prisma_1.Prisma.task.findUnique({
        where: { id: taskId },
    });
    if (!task) {
        throw new Error("TASK_NOT_FOUND");
    }
    if (task.userId !== userId) {
        throw new Error("TASK_FORBIDDEN");
    }
    return prisma_1.Prisma.task.update({
        where: { id: taskId },
        data: {
            status: !task.status,
        },
    });
};
exports.toggleTaskStatusService = toggleTaskStatusService;
//# sourceMappingURL=task.service.js.map