import { prisma } from "../lib/prisma";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

export class TaskService {
  async create(data: unknown) {
    const parsed = createTaskSchema.parse(data);

    return prisma.task.create({
      data: parsed,
    });
  }

  async list() {
    return prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: unknown) {
    const parsed = updateTaskSchema.parse(data);

    return prisma.task.update({
      where: { id },
      data: parsed,
    });
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}

export const taskService = new TaskService();
