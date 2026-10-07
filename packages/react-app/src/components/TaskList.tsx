import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { isLoading, isError, data: tasks } = useTasks();

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>An error has occured</p>;

  if (!tasks || tasks.length === 0) return <p>No tasks yet. Add one above!</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
