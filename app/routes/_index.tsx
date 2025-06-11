// app/routes/_index.tsx

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { TodoService } from "~/lib/db/todo.service";
import { TodoItem } from "~/components/TodoItem";
import { AddTodoForm } from "~/components/AddTodoForm";
import type { TodoActionData } from "~/types/todo";

// 1. LOADER: This function runs on the server to GET data for the page.
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const todoList = await TodoService.getAllTodos(sort);
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

    await TodoService.createTodo(text, priority);
    return null;
  } else if (intent === "toggleDone") {
    const todoId = Number(formData.get("todoId"));
    const currentDoneState = formData.get("done") === "true";
    await TodoService.toggleTodoStatus(todoId, currentDoneState);
    return null;
  } else if (intent === "deleteTodo") {
    const todoId = Number(formData.get("todoId"));
    await TodoService.deleteTodo(todoId);
    return null;
  } else {
    return json({ error: "Invalid intent" }, { status: 400 });
  }
}

// 3. COMPONENT: This is the actual page UI that renders in the browser.
export default function Index() {
  const { todos, sort } = useLoaderData<typeof loader>();
  const nextSort = sort === "asc" ? "desc" : "asc";

  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", 
      lineHeight: "1.8", 
      maxWidth: '600px', 
      margin: '2rem auto' 
    }}>
      <h1>Todo List</h1>

      <div style={{ marginBottom: '1rem' }}>
        <Link to={`/?sort=${nextSort}`}>
          Sort by Priority ({nextSort.toUpperCase()})
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      <hr />

      <AddTodoForm />
    </div>
  );
}