import { FormEvent, useState } from "react";
import { TaskDto } from "../api/generated";
import { useUpdateTask } from "../hooks/useTasks";
import { getErrorMessage } from "../api/errors";

type Props = {
  task: TaskDto;
  onDone: () => void;
};

export default function EditTaskForm({ task, onDone }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const updateTask = useUpdateTask();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateTask.mutate(
      { id: task.id, updateTaskDto: { title, description } },
      { onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button type="submit" disabled={updateTask.isLoading}>
        Save
      </button>{" "}
      <button type="button" onClick={onDone}>
        Cancel
      </button>
      {updateTask.isError && (
        <ul>
          {getErrorMessage(updateTask.error).map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
