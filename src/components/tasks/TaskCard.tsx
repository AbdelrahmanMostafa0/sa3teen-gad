"use client";

import detectStartingLang from "@/utils/detectLang";
import { ITask } from "@/types/tasks";
import { TbCheck } from "react-icons/tb";
import useTasksActions from "@/hooks/useTasksActions";
import useTaskCardLogic from "@/hooks/useTaskCardLogic";
import TaskModal from "./TaskModal";
import { motion, AnimatePresence } from "motion/react";

import { useEffect, useState } from "react";

const TaskCard = ({ task }: { task: ITask }) => {
  const [checked, setChecked] = useState(task.completed);
  const { updateTask, deleteTask } = useTasksActions();
  const taskId = task.id || (task as any)._id;

  const {
    isArabic,
    isOpen,
    handleModalToggle,
    taskCompleted,

  } = useTaskCardLogic(task);
  const handleCheckboxClick = (checked: boolean) => {
    if (!taskId) {
      console.error("Task ID is missing");
      return;
    }
    setChecked(checked);
    updateTask(taskId, { completed: checked });
  };
  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

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
          className={`text-lg font-semibold flex-1 w-full text-start transition-all duration-200 ${checked
            ? "line-through text-foreground/50"
            : "text-foreground group-hover:text-foreground/80"
            }`}
        >
          {task.title}
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => handleCheckboxClick(!checked)}
          className={`shrink-0 h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${checked
            ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/20"
            : "border-slate-300 dark:border-foreground/30 hover:border-slate-400 dark:hover:border-foreground/50 hover:bg-slate-100 dark:hover:bg-foreground/5"
            }`}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <TbCheck
                  className="text-white"
                  size={20}
                  strokeWidth={3}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
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