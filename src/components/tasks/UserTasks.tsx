"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";
import CreateTaskForm from "./CreateTaskForm";

const UserTasks = () => {
  const { fetchAllTasks } = useTasksActions();
  const fetchRef = useRef(false);
  useEffect(() => {
    if (!fetchRef.current) {
      fetchAllTasks();
    }
    fetchRef.current = true;
  }, [fetchAllTasks]);


  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <CreateTaskForm />
      <RenderTasks />
    </div>
  );
};

export default UserTasks;
