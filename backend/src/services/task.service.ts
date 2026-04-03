import { Prisma} from "../lib/prisma";

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
