import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task.controller";

export async function registerTaskRoutes(app: FastifyInstance) {
  app.post("/tasks", TaskController.create);
  app.get("/tasks", TaskController.list);
  app.get("/tasks/:id", TaskController.getById);
  app.put("/tasks/:id", TaskController.update);
  app.delete("/tasks/:id", TaskController.delete);
}
