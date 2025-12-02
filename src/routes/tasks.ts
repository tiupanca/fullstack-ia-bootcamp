import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { Task } from "../types/Task";

// Nosso "banco de dados" em memória
const tasks: Task[] = [];

export async function registerTaskRoutes(app: FastifyInstance) {
  // Criar tarefa
  app.post("/tasks", async (request, reply) => {
    const body = request.body as { title?: string; description?: string };

    if (!body.title) {
      return reply.status(400).send({ error: "title is required" });
    }

    const newTask: Task = {
      id: randomUUID(),
      title: body.title,
      description: body.description,
      done: false,
      createdAt: new Date(),
    };

    tasks.push(newTask);

    return reply.status(201).send(newTask);
  });

  // Listar todas as tarefas
  app.get("/tasks", async () => {
    return tasks;
  });

  // Buscar tarefa por id
  app.get("/tasks/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const task = tasks.find((t) => t.id === params.id);

    if (!task) {
      return reply.status(404).send({ error: "task not found" });
    }

    return task;
  });

  // Atualizar tarefa
  app.put("/tasks/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as {
      title?: string;
      description?: string;
      done?: boolean;
    };

    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1) {
      return reply.status(404).send({ error: "task not found" });
    }

    const current = tasks[taskIndex];

    const updatedTask: Task = {
      ...current,
      title: body.title ?? current.title,
      description: body.description ?? current.description,
      done: body.done ?? current.done,
    };

    tasks[taskIndex] = updatedTask;

    return reply.send(updatedTask);
  });

  // Deletar tarefa
  app.delete("/tasks/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1) {
      return reply.status(404).send({ error: "task not found" });
    }

    tasks.splice(taskIndex, 1);

    return reply.status(204).send();
  });
}
