// scripts/generate-embeddings.ts
import "dotenv/config"; // carrega .env automaticamente
import { openai } from "../src/lib/openai";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Buscando tasks do banco...");

  const tasks = await prisma.task.findMany();

  console.log(`Encontradas ${tasks.length} tasks.`);

  for (const task of tasks) {
    // verifica se já existe embedding
    // retorna um array vazio ou com 1 linha
// checa se já existe embedding convertendo a coluna task_id para text
const existing: any = await prisma.$queryRaw`
  SELECT 1
  FROM task_embedding
  WHERE task_id::text = ${task.id}
  LIMIT 1
`;

// dependendo da versão do Prisma, o resultado pode ser [] ou [{ ?column? : 1 }]
const has = Array.isArray(existing) && existing.length > 0;


    if (has) {
      console.log("Já existe embedding para:", task.id);
      continue;
    }

    const text = `${task.title}${task.description ? " - " + task.description : ""}`;

    console.log("Gerando embedding para:", task.id, `"${text.slice(0, 60)}..."`);

    // Gera embedding (ajuste o model se quiser outro)
const resp = await openai.embeddings.create({
  model: "text-embedding-3-small", // em vez de text-embedding-3-large
  input: text,
});
    const embedding = resp.data[0].embedding as number[];

    // converte para literal do pgvector -> "[0.12,0.34,...]"
    const vecLiteral = "[" + embedding.join(",") + "]";

    // insere no banco (usamos executeRawUnsafe para enviar o literal do vector)
    const sql = `INSERT INTO task_embedding (task_id, embedding) VALUES ('${task.id}', '${vecLiteral}'::vector)`;
    await prisma.$executeRawUnsafe(sql);

    console.log("Embedding salvo para:", task.id);
  }

  console.log("Processo finalizado.");
}

main()
  .catch((err) => {
    console.error("Erro no script:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
