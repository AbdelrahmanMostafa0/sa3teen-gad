"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";
import CreateTaskForm from "./CreateTaskForm";
import { useState } from "react";

const UserTasks = () => {
  const { fetchAllTasks, hasFetched } = useTasksActions();
  const [loading, setLoading] = useState(false);
  const fetchRef = useRef(false);
  useEffect(() => {
    if (!hasFetched) {
      fetchAllTasks();
    }
    fetchRef.current = true;
  }, [fetchAllTasks]);


  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <TasksHeader />
      <CreateTaskForm setLoading={setLoading} />
      <RenderTasks taskLoading={loading} isDraggable />
    </div>
  );
};

export default UserTasks;
