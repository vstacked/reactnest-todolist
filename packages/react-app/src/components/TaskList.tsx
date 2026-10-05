import { useDeleteTask, useTasks } from "../hooks/useTasks";

export default function TaskList() {
  const { isLoading, isError, data: tasks } = useTasks();
  const deleteTask = useDeleteTask();

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>An error has occured</p>;

  if (!tasks || tasks.length === 0) return <p>No tasks yet. Add one above!</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <strong>{task.title}</strong>
          {task.description && ` - ${task.description}`}{" "}
          <button
            onClick={() => deleteTask.mutate(task.id)}
            disabled={deleteTask.isLoading}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
