import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function registerTaskRoutes(app: FastifyInstance) {
  // Criar tarefa no banco
  app.post("/tasks", async (request, reply) => {
    try {
      const body = request.body as { title?: string; description?: string };

      if (!body.title) {
        return reply.status(400).send({ error: "title is required" });
      }

      const task = await prisma.task.create({
        data: {
          title: body.title,
          description: body.description,
        },
      });

      return reply.status(201).send(task);
    } catch (err) {
      return reply.status(500).send({ error: "failed to create task", details: err });
    }
  });

  // Listar tasks do banco
  app.get("/tasks", async (_, reply) => {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
      });

      return reply.send(tasks);
    } catch (err) {
      return reply.status(500).send({ error: "failed to list tasks", details: err });
    }
  });

  // Buscar 1 task pelo ID no banco
  app.get("/tasks/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };

      const task = await prisma.task.findUnique({
        where: { id: params.id },
      });

      if (!task) {
        return reply.status(404).send({ error: "task not found" });
      }

      return task;
    } catch (err) {
      return reply.status(500).send({ error: "failed to fetch task", details: err });
    }
  });

  // Atualizar task no banco
  app.put("/tasks/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = request.body as { title?: string; description?: string; done?: boolean };

      const existing = await prisma.task.findUnique({
        where: { id: params.id },
      });

      if (!existing) {
        return reply.status(404).send({ error: "task not found" });
      }

      const updated = await prisma.task.update({
        where: { id: params.id },
        data: {
          title: body.title ?? existing.title,
          description: body.description ?? existing.description,
          done: body.done ?? existing.done,
        },
      });

      return reply.send(updated);
    } catch (err) {
      return reply.status(500).send({ error: "failed to update task", details: err });
    }
  });

  // Deletar task do banco
  app.delete("/tasks/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };

      const existing = await prisma.task.findUnique({
        where: { id: params.id },
      });

      if (!existing) {
        return reply.status(404).send({ error: "task not found" });
      }

      await prisma.task.delete({
        where: { id: params.id },
      });

      return reply.status(204).send();
    } catch (err) {
      return reply.status(500).send({ error: "failed to delete task", details: err });
    }
  });
}
