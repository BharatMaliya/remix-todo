import { Form, useActionData } from "@remix-run/react";
import { PRIORITIES } from "~/common/common";
import { useTodoForm } from "~/hooks/useTodoForm";
import { useEffect } from "react";

export function AddTodoForm() {
  const actionData = useActionData<{ error?: string }>();
  const { validateForm, getFieldError, errors } = useTodoForm();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    if (!validateForm(formData)) {
      event.preventDefault();
    }
  };

  return (
    <div>
      <h3>Add a New Todo</h3>
      <Form method="post" onSubmit={handleSubmit}>
        <input type="hidden" name="intent" value="addTodo" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <input 
              type="text" 
              name="text" 
              placeholder="What needs to be done?" 
              required 
              aria-invalid={Boolean(getFieldError("text"))}
              aria-errormessage={getFieldError("text") ? "text-error" : undefined}
            />
            {getFieldError("text") && (
              <div id="text-error" style={{ color: 'red', fontSize: '0.875rem' }}>
                {getFieldError("text")}
              </div>
            )}
          </div>

          <div>
            <select 
              name="priority" 
              defaultValue="1"
              aria-invalid={Boolean(getFieldError("priority"))}
              aria-errormessage={getFieldError("priority") ? "priority-error" : undefined}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            {getFieldError("priority") && (
              <div id="priority-error" style={{ color: 'red', fontSize: '0.875rem' }}>
                {getFieldError("priority")}
              </div>
            )}
          </div>

          <button type="submit">Add Todo</button>
          
          {actionData?.error && (
            <div style={{ color: 'red', fontSize: '0.875rem' }}>
              {actionData.error}
            </div>
          )}
        </div>
      </Form>
    </div>
  );
} 