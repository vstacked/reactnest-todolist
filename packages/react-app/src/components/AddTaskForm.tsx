import axios from "axios";
import { FormEvent, useState } from "react";
import { useCreateTask } from "../hooks/useTasks";

function getErrorMessage(error: unknown): string[] {
  if (axios.isAxiosError(error) && error.response) {
    const { message } = error.response.data as { message?: string | string[] };
    if (Array.isArray(message)) return message;
    if (message) return [message];
  }
  return ["Something went wrong, please try again."];
}

export default function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createTask = useCreateTask();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createTask.mutate(
      { title, description },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <button type="submit" disabled={createTask.isLoading}>
        Add task
      </button>

      {createTask.isError && (
        <ul>
          {getErrorMessage(createTask.error).map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
