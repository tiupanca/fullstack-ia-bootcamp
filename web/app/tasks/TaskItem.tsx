"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  done: boolean;
  createdAt: string;
};

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggleDone() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3333/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: !task.done,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Erro ao atualizar tarefa");
      }

      // recarrega a lista (chama getTasks de novo)
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao atualizar tarefa:", err);
      setError(err.message || "Erro ao atualizar tarefa");
    } finally {
      setLoading(false);
    }
  }

  const isDone = task.done;

  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
      <div>
        <h2 className="font-semibold">
          {isDone ? (
            <span className="line-through text-slate-400">{task.title}</span>
          ) : (
            task.title
          )}
        </h2>
        {task.description && (
          <p className="text-sm text-slate-400">{task.description}</p>
        )}
        <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
          Criada em: {new Date(task.createdAt).toLocaleString("pt-BR")}
        </p>

        {error && (
          <p className="mt-1 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={
            "inline-flex h-6 items-center rounded-full px-3 text-xs " +
            (isDone
              ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
              : "bg-amber-900/40 text-amber-300 border border-amber-700")
          }
        >
          {isDone ? "Concluída" : "Pendente"}
        </span>

        <button
          onClick={handleToggleDone}
          disabled={loading}
          className="text-xs rounded-lg border border-slate-700 px-3 py-1 text-slate-100 hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Atualizando..." : isDone ? "Reabrir" : "Concluir"}
        </button>
      </div>
    </li>
  );
}
