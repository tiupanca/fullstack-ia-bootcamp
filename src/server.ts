import Fastify from "fastify";

const app = Fastify({
  logger: true, // mostra logs das requisições no terminal
});

// Rota de teste para ver se o servidor está no ar
app.get("/health", async () => {
  return { status: "ok" };
});

// Inicia o servidor na porta 3333
app
  .listen({ port: 3333 })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  });
