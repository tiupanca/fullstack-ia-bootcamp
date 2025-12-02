type Task = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
};

async function getTasks(): Promise<Task[]> {
  const res = await fetch("http://localhost:3333/tasks", {
    // impede cache e sempre busca a lista atual
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar tarefas da API");
  }

  return res.json();
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Minhas tarefas</h1>
        <p className="text-sm text-slate-400 mb-6">
          Dados vindo da API em Fastify + PostgreSQL via Prisma.
        </p>

        {tasks.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-400">
            Nenhuma tarefa cadastrada ainda. Crie uma pela API/Insomnia para
            aparecer aqui.
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <h2 className="font-semibold">
                    {task.done ? (
                      <span className="line-through text-slate-400">
                        {task.title}
                      </span>
                    ) : (
                      task.title
                    )}
                  </h2>
                  {task.description && (
                    <p className="text-sm text-slate-400">
                      {task.description}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                    Criada em:{" "}
                    {new Date(task.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                <span
                  className={
                    "mt-1 inline-flex h-6 items-center rounded-full px-3 text-xs " +
                    (task.done
                      ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                      : "bg-amber-900/40 text-amber-300 border border-amber-700")
                  }
                >
                  {task.done ? "Concluída" : "Pendente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
