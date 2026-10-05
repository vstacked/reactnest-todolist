import React from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>TODO list</h1>
      <AddTaskForm />
      <TaskList />
    </QueryClientProvider>
  );
}
