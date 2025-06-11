import { db } from "~/db.server";
import { todos } from "~/schema.server";
import { asc, desc, eq } from "drizzle-orm";
import type { Todo } from "~/types/todo";

export class TodoService {
  static async getAllTodos(sort: string | null): Promise<Todo[]> {
    const orderBy = sort === "asc" ? asc(todos.priority) : desc(todos.priority);
    return db.select().from(todos).orderBy(orderBy);
  }

  static async createTodo(text: string, priority: number): Promise<void> {
    await db.insert(todos).values({ text, priority });
  }

  static async toggleTodoStatus(todoId: number, currentDoneState: boolean): Promise<void> {
    await db
      .update(todos)
      .set({ done: !currentDoneState })
      .where(eq(todos.id, todoId));
  }

  static async deleteTodo(todoId: number): Promise<void> {
    await db
      .delete(todos)
      .where(eq(todos.id, todoId));
  }
} 