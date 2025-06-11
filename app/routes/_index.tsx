// app/routes/_index.tsx

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { todos } from "~/schema.server";
import { asc, desc ,eq } from "drizzle-orm";
import { PRIORITIES } from "~/common/common";

// 1. LOADER: This function runs on the server to GET data for the page.
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");

  const orderBy =
    sort === "asc"
      ? asc(todos.priority)
      : desc(todos.priority); // Default to descending

  const todoList = await db.select().from(todos).orderBy(orderBy);

  return json({ todos: todoList, sort });
}

// 2. ACTION: This function runs on the server to handle form POST requests.
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

    if (intent === "addTodo") {
    const text = formData.get("text") as string;
    const priority = Number(formData.get("priority"));

    if (!text) {
      return json({ error: "Text cannot be empty" }, { status: 400 });
    }

    await db.insert(todos).values({ text, priority });
    return null; 
  }else if (intent === "toggleDone") {
    const todoId = Number(formData.get("todoId"));
    const currentDoneState = formData.get("done") === "true";

    await db
      .update(todos)
      .set({ done: !currentDoneState }) 
      .where(eq(todos.id, todoId)); 
    
    return null;
  }else if (intent === "deleteTodo") {
    const todoId = Number(formData.get("todoId"));
    
    await db
      .delete(todos)
      .where(eq(todos.id, todoId)); 
      
    return null;
  }else {
    return json({ error: "Invalid intent" }, { status: 400 });
  }
}

// 3. COMPONENT: This is the actual page UI that renders in the browser.
export default function Index() {
  const { todos, sort } = useLoaderData<typeof loader>();
  const nextSort = sort === "asc" ? "desc" : "asc";

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Todo List</h1>

      <div style={{ marginBottom: '1rem' }}>
        <Link to={`/?sort=${nextSort}`}>
          Sort by Priority ({nextSort.toUpperCase()})
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ padding: '0.5rem', border: '1px solid #ccc', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {todo.done ? "✅" : "❌"} {todo.text}
            </span>
            <span>Priority: {PRIORITIES.find(el=>el.value ===todo.priority)?.label}</span>
            <Form method="post">
                <input type="hidden" name="intent" value="toggleDone" />
                <input type="hidden" name="todoId" value={todo.id} />
                <input type="hidden" name="done" value={String(todo.done)} />
                <button type="submit" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}>
                  {todo.done ? "Undo" : "Mark as done"}
                </button>
              </Form>
              <Form method="post">
                <input type="hidden" name="intent" value="deleteTodo" />
                <input type="hidden" name="todoId" value={todo.id} />
                <button type="submit" style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>
                  Delete
                </button>
              </Form>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Add a New Todo</h3>
      <Form method="post">
        <input type="hidden" name="intent" value="addTodo" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input type="text" name="text" placeholder="What needs to be done?" required />
          <select name="priority" defaultValue="1">
            {
              PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))
            }
          </select>
          <button type="submit">Add Todo</button>
        </div>
      </Form>
    </div>
  );
}