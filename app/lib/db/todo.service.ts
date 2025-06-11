import { db } from "~/db.server";
import { todos } from "~/schema.server";
import { asc, desc, eq } from "drizzle-orm";
import type { Todo } from "~/types/todo";
import { createTodoSchema, toggleTodoSchema, deleteTodoSchema } from "~/lib/schemas/todo.schema";

export class TodoService {
  static async getAllTodos(sort: string | null): Promise<Todo[]> {
    const orderBy = sort === "asc" ? asc(todos.priority) : desc(todos.priority);
    return db.select().from(todos).orderBy(orderBy);
  }

  static async createTodo(text: string, priority: number): Promise<void> {
    // Validate input data
    const result = createTodoSchema.safeParse({ text, priority });
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    await db.insert(todos).values(result.data);
  }

  static async toggleTodoStatus(todoId: number, currentDoneState: boolean): Promise<void> {
    // Validate input data
    const result = toggleTodoSchema.safeParse({ todoId, done: currentDoneState });
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    await db
      .update(todos)
      .set({ done: !currentDoneState })
      .where(eq(todos.id, todoId));
  }

  static async deleteTodo(todoId: number): Promise<void> {
    // Validate input data
    const result = deleteTodoSchema.safeParse({ todoId });
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    await db
      .delete(todos)
      .where(eq(todos.id, todoId));
  }
} 