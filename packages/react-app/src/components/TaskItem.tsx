import { useState } from "react";
import { TaskDto } from "../api/generated";
import { useDeleteTask } from "../hooks/useTasks";
import EditTaskForm from "./EditTaskForm";

type Props = {
  task: TaskDto;
};

export default function TaskItem({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const deleteTask = useDeleteTask();

  if (isEditing) {
    return (
      <li>
        <EditTaskForm task={task} onDone={() => setIsEditing(false)} />
      </li>
    );
  }

  return (
    <li>
      <strong>{task.title}</strong>
      {task.description && ` - ${task.description}`}{" "}
      <button onClick={() => setIsEditing(true)}>Edit</button>{" "}
      <button
        onClick={() => deleteTask.mutate(task.id)}
        disabled={deleteTask.isLoading}
      >
        Remove
      </button>
    </li>
  );
}
