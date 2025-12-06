import { FastifyReply, FastifyRequest } from "fastify";
import { taskService } from "../services/task.service";

export const TaskController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const task = await taskService.create(request.body);
      return reply.status(201).send(task);
    } catch (err) {
      return reply.status(400).send({ error: String(err) });
    }
  },

  list: async (_req: FastifyRequest, reply: FastifyReply) => {
    const tasks = await taskService.list();
    return reply.send(tasks);
  },

  getById: async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    const task = await taskService.getById(id);
    if (!task) return reply.status(404).send({ error: "not found" });

    return reply.send(task);
  },

  update: async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    try {
      const task = await taskService.update(id, req.body);
      return reply.send(task);
    } catch (err) {
      return reply.status(400).send({ error: String(err) });
    }
  },

  delete: async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    try {
      await taskService.delete(id);
      return reply.status(204).send();
    } catch (err) {
      return reply.status(400).send({ error: String(err) });
    }
  },
};
