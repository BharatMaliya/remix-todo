import { InferSelectModel } from "drizzle-orm";
import { todos } from "~/schema.server";

export type Todo = InferSelectModel<typeof todos>;

export type Priority = {
  value: number;
  label: string;
};

export type TodoFormData = {
  text: string;
  priority: number;
};

export type TodoActionData = {
  error?: string;
}; 