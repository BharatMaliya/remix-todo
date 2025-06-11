import { Form } from "@remix-run/react";
import type { Todo } from "~/types/todo";
import { PRIORITIES } from "~/common/common";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  return (
    <li style={{ 
      padding: '0.5rem', 
      border: '1px solid #ccc', 
      marginBottom: '0.5rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <span>
        {todo.done ? "✅" : "❌"} {todo.text}
      </span>
      <span>Priority: {PRIORITIES.find(el => el.value === todo.priority)?.label}</span>
      <Form method="post">
        <input type="hidden" name="intent" value="toggleDone" />
        <input type="hidden" name="todoId" value={todo.id} />
        <input type="hidden" name="done" value={String(todo.done)} />
        <button 
          type="submit" 
          style={{ 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer', 
            fontSize: '1rem' 
          }}
        >
          {todo.done ? "Undo" : "Mark as done"}
        </button>
      </Form>
      <Form method="post">
        <input type="hidden" name="intent" value="deleteTodo" />
        <input type="hidden" name="todoId" value={todo.id} />
        <button 
          type="submit" 
          style={{ 
            color: 'red', 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          Delete
        </button>
      </Form>
    </li>
  );
} 