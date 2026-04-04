import { Prisma } from "../lib/prisma";

export const createTaskService = async (
  userId: string,
  data: { title: string; description?: string }
) => {
  return await Prisma.task.create({
    data: {
      title: data.title,
      userId,
      ...(data.description !== undefined ? { description: data.description } : {}),
    },
  });
};

export const updateTaskService = async (
  taskId: string,
  userId: string,
  data: { title?: string; description?: string; status?: boolean }
) => {
  const task = await Prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  if (task.userId !== userId) {
    throw new Error("TASK_FORBIDDEN");
  }

  return Prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await Prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  if (task.userId !== userId) {
    throw new Error("TASK_FORBIDDEN");
  }

  return Prisma.task.delete({
    where: { id: taskId },
  });
};
