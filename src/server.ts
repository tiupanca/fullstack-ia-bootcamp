import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerTaskRoutes } from "./routes/tasks";

async function bootstrap() {
  const app = Fastify({
    logger: true,
  });

  // CORS liberado pra desenvolvimento
  await app.register(cors, {
    origin: true, // aceita qualquer origem durante o dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(registerTaskRoutes);

  try {
    await app.listen({ port: 3333 });
    console.log("HTTP server running on http://localhost:3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
