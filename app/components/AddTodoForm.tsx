import { Form } from "@remix-run/react";
import { PRIORITIES } from "~/common/common";

export function AddTodoForm() {
  return (
    <div>
      <h3>Add a New Todo</h3>
      <Form method="post">
        <input type="hidden" name="intent" value="addTodo" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input 
            type="text" 
            name="text" 
            placeholder="What needs to be done?" 
            required 
          />
          <select name="priority" defaultValue="1">
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
          <button type="submit">Add Todo</button>
        </div>
      </Form>
    </div>
  );
} 