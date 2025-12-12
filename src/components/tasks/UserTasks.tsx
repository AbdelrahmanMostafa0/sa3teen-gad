"use client";

import useTasks from "@/hooks/useTasks";
import NewTaskForm from "./NewTaskForm";
import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";

const UserTasks = () => {
  const { tasks } = useTasks();
  const { tasks: allTasks } = useTasksActions()

  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <NewTaskForm />
      <RenderTasks tasks={tasks} />
    </div>
  );
};

export default UserTasks;
