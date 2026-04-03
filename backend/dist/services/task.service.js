"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskService = void 0;
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
//# sourceMappingURL=task.service.js.map