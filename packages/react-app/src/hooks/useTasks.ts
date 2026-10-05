import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateTaskDto, TaskDto } from "../api/generated";
import { tasksApi } from "../api/api";

const TASK_QUERY_KEY = "task";

export function useTasks() {
  return useQuery<TaskDto[], Error>(TASK_QUERY_KEY, async () => {
    const response = await tasksApi.taskControllerFindAll();
    return response.data;
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation(
    (createTaskDto: CreateTaskDto) =>
      tasksApi.taskControllerCreate({ createTaskDto }),
    {
      onSuccess: () => queryClient.invalidateQueries(TASK_QUERY_KEY),
    },
  );
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation((id: number) => tasksApi.taskControllerRemove({ id }), {
    onSuccess: () => queryClient.invalidateQueries(TASK_QUERY_KEY),
  });
}
