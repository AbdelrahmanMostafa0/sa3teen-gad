"use client";

import { useEffect, useRef } from "react";
import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";
import CreateTaskForm from "./LoggedInTaskForm";

const UserTasks = () => {
  const { fetchAllTasks, hasFetched, loading } = useTasksActions();
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    if (!hasFetched && !loading) {
      console.log("fetching tasks from UserTasks");
      fetched.current = true;
      fetchAllTasks();
    }
  }, [hasFetched, fetchAllTasks, loading]);

  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <CreateTaskForm />
      <RenderTasks />
    </div>
  );
};

export default UserTasks;
