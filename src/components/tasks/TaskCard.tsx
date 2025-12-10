"use client";

import detectStartingLang from "@/utils/detectLang";
import { ITask } from "@/types/tasks";
import { TbCheck } from "react-icons/tb";
import useTasks from "@/hooks/useTasks";
import useTasksActions from "@/hooks/useTasksActions";
import useTaskCardLogic from "@/hooks/useTaskCardLogic";
import TaskModal from "./TaskModal";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "motion/react";

import { useUser } from "@/hooks/useUser";

const TaskCard = ({ task }: { task: ITask }) => {
  const { isAuthenticated } = useUser()
  const localHooks = useTasks();
  const apiHooks = useTasksActions();

  const { updateTask, deleteTask } = isAuthenticated ? apiHooks : localHooks;

  const {
    isArabic,
    isOpen,
    handleModalToggle,
    handleCheckboxClick,
    taskCompleted,
  } = useTaskCardLogic(task);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      dir={isArabic ? "rtl" : "ltr"}
      className={`group relative bg-card border border-foreground/10 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-foreground/20 ${taskCompleted ? "opacity-60" : ""
        }`}
    >
      <div className="relative flex items-center justify-between gap-4">
        <button
          onClick={handleModalToggle}
          className={`text-lg font-semibold flex-1 w-full text-start transition-all duration-200 ${taskCompleted
            ? "line-through text-foreground/50"
            : "text-foreground group-hover:text-foreground/80"
            }`}
        >
          {task.title}
        </button>

        <Checkbox
          checked={taskCompleted}
          onCheckedChange={handleCheckboxClick}
          className="h-6 w-6 transition-transform duration-200 hover:scale-110"
        />
      </div>

      <TaskModal
        task={task}
        isOpen={isOpen}
        setIsOpen={handleModalToggle}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </motion.div>
  );
};

export default TaskCard;