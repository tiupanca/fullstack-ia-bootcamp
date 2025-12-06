import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  done: z.boolean().optional(),
});
