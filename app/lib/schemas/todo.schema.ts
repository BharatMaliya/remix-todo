import { z } from "zod";

// Schema for creating a new todo
export const createTodoSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(255, "Text is too long"),
  priority: z.number().int().min(1).max(3),
});

// Schema for toggling todo status
export const toggleTodoSchema = z.object({
  todoId: z.number().int().positive(),
  done: z.boolean(),
});

// Schema for deleting a todo
export const deleteTodoSchema = z.object({
  todoId: z.number().int().positive(),
});

// Schema for form data
export const todoFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("addTodo"),
    text: z.string().min(1, "Text cannot be empty").max(255, "Text is too long"),
    priority: z.coerce.number().int().min(1).max(3),
  }),
  z.object({
    intent: z.literal("toggleDone"),
    todoId: z.coerce.number().int().positive(),
    done: z.coerce.boolean(),
  }),
  z.object({
    intent: z.literal("deleteTodo"),
    todoId: z.coerce.number().int().positive(),
  }),
]);

// Type inference from schemas
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
export type TodoFormData = z.infer<typeof todoFormSchema>; 