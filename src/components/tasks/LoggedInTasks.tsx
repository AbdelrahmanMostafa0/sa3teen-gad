"use client";

import useTasksActions from "@/hooks/useTasksActions";
import LoggedInTaskForm from "./LoggedInTaskForm";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";

const LoggedInTasks = () => {
  const { tasks } = useTasksActions();

  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <LoggedInTaskForm />
      <RenderTasks tasks={tasks} />
    </div>
  );
};

export default LoggedInTasks;
