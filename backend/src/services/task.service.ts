import { Prisma } from "../lib/prisma";

type GetTasksOptions = {
  userId: string;
  page: number;
  limit: number;
  status?: boolean;
  search?: string;
};

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

export const getTasksService = async ({
  userId,
  page,
  limit,
  status,
  search,
}: GetTasksOptions) => {
  const whereClause = {
    userId,
    ...(status !== undefined ? { status } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    Prisma.task.count({
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
