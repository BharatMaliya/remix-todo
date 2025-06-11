import { json, type TypedResponse } from "@remix-run/node";
import { TodoService } from "~/lib/db/todo.service";
import type { TodoActionData } from "~/types/todo";

export class TodoActions {
  static async handleAddTodo(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const text = formData.get("text") as string;
    const priority = Number(formData.get("priority"));

    if (!text) {
      return json({ error: "Text cannot be empty" }, { status: 400 });
    }

    await TodoService.createTodo(text, priority);
    return null;
  }

  static async handleToggleDone(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const todoId = Number(formData.get("todoId"));
    const currentDoneState = formData.get("done") === "true";
    await TodoService.toggleTodoStatus(todoId, currentDoneState);
    return null;
  }

  static async handleDeleteTodo(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const todoId = Number(formData.get("todoId"));
    await TodoService.deleteTodo(todoId);
    return null;
  }

  static async handleAction(formData: FormData): Promise<TodoActionData | TypedResponse<TodoActionData> | null> {
    const intent = formData.get("intent");

    switch (intent) {
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