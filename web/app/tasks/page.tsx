import { TaskForm } from "./TaskForm";
import { TaskItem, Task } from "./TaskItem";

async function getTasks(): Promise<Task[]> {
  const res = await fetch("http://localhost:3333/tasks", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar tarefas da API");
  }

  return res.json();
}

type AiPriorityResponse = {
  tasks: {
    id: string;
    priority: number;
    reason: string;
  }[];
  summary: string | null;
};

async function getAiPriorities(): Promise<AiPriorityResponse> {
  try {
    const res = await fetch("http://localhost:3333/tasks/ai/priority", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        "Falha ao buscar prioridades da IA. Status:",
        res.status,
        res.statusText
      );
      return { tasks: [], summary: null };
    }

    return res.json();
  } catch (err) {
    console.error("Erro de rede ao chamar IA:", err);
    return { tasks: [], summary: null };
  }
}

export default async function TasksPage() {
  const [tasks, aiData] = await Promise.all([getTasks(), getAiPriorities()]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Minhas tarefas</h1>
        <p className="text-sm text-slate-400 mb-6">
          Dados vindo da API em Fastify + PostgreSQL via Prisma.
        </p>

        <TaskForm />

        {/* Card da IA */}
        <div className="mb-8 rounded-xl border border-indigo-800 bg-indigo-950/40 p-4">
          <h2 className="text-sm font-semibold text-indigo-200 mb-2">
            Prioridade sugerida pela IA
          </h2>

          {aiData.tasks.length === 0 ? (
            <p className="text-xs text-indigo-200/80">
              {!tasks.some((t) => !t.done)
                ? "Nenhuma tarefa pendente para priorizar."
                : "IA indisponível no momento ou não conseguiu gerar prioridades. As tarefas abaixo estão sem ordenação especial."}
            </p>
          ) : (
            <>
              <p className="text-xs text-indigo-200/80 mb-3">
                A IA analisou suas tarefas pendentes e sugeriu a seguinte
                ordem:
              </p>

              <ol className="space-y-1 text-sm">
                {aiData.tasks
                  .slice()
                  .sort((a, b) => a.priority - b.priority)
                  .map((item) => {
                    const task = tasks.find((t) => t.id === item.id);
                    if (!task) return null;

                    return (
                      <li key={item.id} className="flex flex-col">
                        <span>
                          <span className="font-semibold">
                            {item.priority}. {task.title}
                          </span>
                        </span>
                        <span className="text-xs text-indigo-200/80">
                          {item.reason}
                        </span>
                      </li>
                    );
                  })}
              </ol>

              {aiData.summary && (
                <p className="mt-3 text-xs text-indigo-100/80">
                  <span className="font-semibold">Resumo da IA: </span>
                  {aiData.summary}
                </p>
              )}
            </>
          )}
        </div>

        {/* Lista de tarefas normal */}
        {tasks.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-400">
            Nenhuma tarefa cadastrada ainda. Crie uma pela interface acima ou
            via API/Insomnia para aparecer aqui.
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
