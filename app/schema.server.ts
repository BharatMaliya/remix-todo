// app/schema.server.ts
import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  priority: integer("priority").default(1).notNull(), // e.g., 1=low, 2=medium, 3=high
});