"use client";

import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";
import CreateTaskForm from "./LoggedInTaskForm";

const UserTasks = () => {
  const { tasks, loading } = useTasksActions();

  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <CreateTaskForm />
      <RenderTasks tasks={tasks} loading={loading} />
    </div>
  );
};

export default UserTasks;
