import { json, type TypedResponse } from "@remix-run/node";
import { TodoService } from "~/lib/db/todo.service";
import type { TodoActionData } from "~/types/todo";
import { todoFormSchema } from "~/lib/schemas/todo.schema";

export class TodoActions {
  private static parseFormData(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    return todoFormSchema.safeParse(rawData);
  }

  static async handleAddTodo(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const result = this.parseFormData(formData);
    
    if (!result.success) {
      return json({ error: result.error.errors[0].message }, { status: 400 });
    }

    if (result.data.intent !== "addTodo") {
      return json({ error: "Invalid intent for addTodo" }, { status: 400 });
    }

    const { text, priority } = result.data;
    await TodoService.createTodo(text, priority);
    return null;
  }

  static async handleToggleDone(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const result = this.parseFormData(formData);
    
    if (!result.success) {
      return json({ error: result.error.errors[0].message }, { status: 400 });
    }

    if (result.data.intent !== "toggleDone") {
      return json({ error: "Invalid intent for toggleDone" }, { status: 400 });
    }

    const { todoId, done } = result.data;
    await TodoService.toggleTodoStatus(todoId, done);
    return null;
  }

  static async handleDeleteTodo(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const result = this.parseFormData(formData);
    
    if (!result.success) {
      return json({ error: result.error.errors[0].message }, { status: 400 });
    }

    if (result.data.intent !== "deleteTodo") {
      return json({ error: "Invalid intent for deleteTodo" }, { status: 400 });
    }

    const { todoId } = result.data;
    await TodoService.deleteTodo(todoId);
    return null;
  }

  static async handleAction(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const result = this.parseFormData(formData);
    
    if (!result.success) {
      return json({ error: result.error.errors[0].message }, { status: 400 });
    }

    switch (result.data.intent) {
      case "addTodo":
        return this.handleAddTodo(formData);
      case "toggleDone":
        return this.handleToggleDone(formData);
      case "deleteTodo":
        return this.handleDeleteTodo(formData);
      default:
        return json({ error: "Invalid intent" }, { status: 400 });
    }
  }
} 