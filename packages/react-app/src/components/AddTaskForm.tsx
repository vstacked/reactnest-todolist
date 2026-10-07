import { FormEvent, useState } from "react";
import { useCreateTask } from "../hooks/useTasks";
import { getErrorMessage } from "../api/errors";

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
