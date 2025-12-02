import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function registerTaskRoutes(app: FastifyInstance) {
  // Criar tarefa
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
      console.error(err);
      return reply
        .status(500)
        .send({ error: "failed to create task", details: String(err) });
    }
  });

  // Listar tarefas
  app.get("/tasks", async (_request, reply) => {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: "desc" },
      });

      return reply.send(tasks);
    } catch (err) {
      console.error(err);
      return reply
        .status(500)
        .send({ error: "failed to list tasks", details: String(err) });
    }
  });

  // Buscar tarefa por id
  app.get("/tasks/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };

      const task = await prisma.task.findUnique({
        where: { id: params.id },
      });

      if (!task) {
        return reply.status(404).send({ error: "task not found" });
      }

      return reply.send(task);
    } catch (err) {
      console.error(err);
      return reply
        .status(500)
        .send({ error: "failed to fetch task", details: String(err) });
    }
  });

  // Atualizar tarefa
  app.put("/tasks/:id", async (request, reply) => {
    try {
      const params = request.params as { id: string };
      const body = request.body as {
        title?: string;
        description?: string;
        done?: boolean;
      };

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
      console.error(err);
      return reply
        .status(500)
        .send({ error: "failed to update task", details: String(err) });
    }
  });

  // Deletar tarefa
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
      console.error(err);
      return reply
        .status(500)
        .send({ error: "failed to delete task", details: String(err) });
    }
  });

  // IA: sugerir prioridades
  app.get("/tasks/ai/priority", async (_request, reply) => {
    try {
      const tasks = await prisma.task.findMany({
        where: { done: false },
        orderBy: { createdAt: "asc" },
      });

      if (tasks.length === 0) {
        return reply.send({
          tasks: [],
          summary: "Nenhuma tarefa pendente para priorizar.",
        });
      }

      const systemPrompt = `
Você é um assistente que prioriza tarefas pessoais.
Você receberá uma lista de tarefas com id, título, descrição e data de criação.
Retorne um JSON com:

{
  "orderedTasks": [
    {
      "id": "id-da-task",
      "priority": 1,
      "reason": "explicação curta"
    }
  ],
  "summary": "comentário geral"
}
`;

      const userContent = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.id}] ${task.title} - ${
              task.description ?? ""
            } (criada em ${task.createdAt.toISOString()})`
        )
        .join("\n");

      const completion = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
      });

      const firstOutput = completion.output[0].content[0];

      const jsonText =
        (firstOutput as any).type === "output_text"
          ? (firstOutput as any).text
          : JSON.stringify(firstOutput);

      let parsed: {
        orderedTasks: { id: string; priority: number; reason: string }[];
        summary?: string;
      };

      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        console.error("Erro ao fazer parse da resposta da IA:", err, jsonText);
        return reply.status(500).send({
          error: "Falha ao interpretar resposta da IA",
        });
      }

      const tasksById = new Map(tasks.map((t) => [t.id, t]));

      const enriched = parsed.orderedTasks
        .map((item) => {
          const task = tasksById.get(item.id);
          if (!task) return null;

          return {
            id: task.id,
            title: task.title,
            description: task.description,
            done: task.done,
            createdAt: task.createdAt,
            priority: item.priority,
            reason: item.reason,
          };
        })
        .filter(Boolean);

      return reply.send({
        tasks: enriched,
        summary: parsed.summary ?? null,
      });
    } catch (err) {
      console.error(err);
      return reply
        .status(500)
        .send({ error: "Erro ao gerar prioridades com IA" });
    }
  });
}
