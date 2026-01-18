"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useTasksActions from "@/hooks/useTasksActions";
import RenderTasks from "./RenderTasks";
import TasksHeader from "./TasksHeader";
import CreateTaskForm from "./CreateTaskForm";
import { ListFilter } from "lucide-react";

const UserTasks = () => {
  const { fetchAllTasks, hasFetched, loading } = useTasksActions();
  const { homeTaskFilter } = useSelector((state: RootState) => state.Settings);
  useEffect(() => {
    fetchAllTasks();
  }, [homeTaskFilter, fetchAllTasks]);

  const filterLabels = {
    today: "اليوم",
    week: "هذا الأسبوع",
    month: "هذا الشهر",
    all_time: "كل الوقت",
  };

  return (
    <div className="w-full space-y-6 max-w-[700px]">
      <div className="space-y-4">
        <TasksHeader />
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-foreground/5 w-fit px-3 py-1.5 rounded-full border border-foreground/10">
          <ListFilter className="w-4 h-4" />
          <span>عرض المهام لـ : </span>
          <span className="font-bold text-foreground">
            {filterLabels[homeTaskFilter as keyof typeof filterLabels] ||
              homeTaskFilter}
          </span>
        </div>
      </div>
      <CreateTaskForm />
      <RenderTasks />
    </div>
  );
};

export default UserTasks;
