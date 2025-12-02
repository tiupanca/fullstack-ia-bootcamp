import Fastify from "fastify";
import { registerTaskRoutes } from "./routes/tasks";

const app = Fastify({
  logger: true,
});

// Rota de saúde (pra ver se está no ar)
app.get("/health", async () => {
  return { status: "ok" };
});

// Registra as rotas de tasks
app.register(registerTaskRoutes);

// Sobe o servidor
app
  .listen({ port: 3333 })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  });
