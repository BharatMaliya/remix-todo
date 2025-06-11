import { z } from "zod";

// Base schemas for individual operations
export const createTodoSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(255, "Text is too long"),
  priority: z.number().int().min(1).max(3),
});

export const toggleTodoSchema = z.object({
  todoId: z.number().int().positive(),
  done: z.boolean(),
});

export const deleteTodoSchema = z.object({
  todoId: z.number().int().positive(),
});

// Form schema that reuses the base schemas
export const todoFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("addTodo"),
  }).merge(createTodoSchema),
  z.object({
    intent: z.literal("toggleDone"),
  }).merge(toggleTodoSchema),
  z.object({
    intent: z.literal("deleteTodo"),
  }).merge(deleteTodoSchema),
]);

// Type inference from schemas
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
export type TodoFormData = z.infer<typeof todoFormSchema>; 