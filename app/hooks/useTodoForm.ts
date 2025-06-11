import { useState } from "react";
import { todoFormSchema } from "~/lib/schemas/todo.schema";
import type { TodoFormData } from "~/lib/schemas/todo.schema";

export function useTodoForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const rawData = Object.fromEntries(formData.entries());
    const result = todoFormSchema.safeParse(rawData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const getFieldError = (fieldName: string) => errors[fieldName];

  return {
    validateForm,
    getFieldError,
    errors,
  };
} 