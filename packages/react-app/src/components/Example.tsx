import { useQuery } from "react-query";
import { tasksApi } from "../api/api";

export default function Example() {
  const id = "1";

  const { isLoading, error, data } = useQuery(`tasks_find_one_${id}`, () =>
    tasksApi.taskControllerFindOne({
      id,
    }),
  );

  console.log("data", data);

  if (isLoading) return <div>Loading...</div>;

  if (error as Error) return <div>An error has occurred</div>;

  return <div>{data?.data.title}</div>;
}
