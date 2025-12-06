"use client";

import detectStartingLang from "@/utils/detectLang";
import { TaskType } from "@/types/tasks";
import { TbTrash, TbX, TbCalendar, TbCheck } from "react-icons/tb";
import useTasks from "@/hooks/useTasks";
import { formatArabicDate } from "@/utils/date";
import useTaskCardLogic from "@/hooks/useTaskCardLogic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

const TaskCard = ({ task }: { task: TaskType }) => {
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
          className={`text-lg font-semibold flex-1 text-start transition-all duration-200 ${taskCompleted
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

      <TaskModal task={task} isOpen={isOpen} setIsOpen={handleModalToggle} />
    </motion.div>
  );
};

export default TaskCard;

type TaskModalProps = {
  task: TaskType;
  isOpen: boolean;
  setIsOpen: () => void;
};

const TaskModal = ({ task, isOpen, setIsOpen }: TaskModalProps) => {
  const { deleteTask, updateTask } = useTasks();
  const isArabic = detectStartingLang(task.title) === "arabic";

  const handleCheckboxClick = (checked: boolean) => {
    updateTask(task.id, { completed: checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] md:max-w-[700px] border-0 p-0 gap-0 bg-white dark:bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-foreground/5 dark:to-foreground/10 border-b border-slate-200 dark:border-foreground/10">
          <DialogHeader>
            <div dir={isArabic ? "rtl" : "ltr"} className="p-6 pb-5">
              <div className="flex items-center gap-3">
                {/* Custom checkbox with animation */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCheckboxClick(!task.completed)}
                  className={`flex-shrink-0 h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${task.completed
                    ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/20"
                    : "border-slate-300 dark:border-foreground/30 hover:border-slate-400 dark:hover:border-foreground/50 hover:bg-slate-100 dark:hover:bg-foreground/5"
                    }`}
                >
                  <AnimatePresence>
                    {task.completed && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <TbCheck className="text-white" size={20} strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Title input with clean styling */}
                <div className="flex-1 min-w-0">
                  <Input
                    onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    defaultValue={task.title}
                    // className={`text-lg md:text-xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0 h-auto py-1 transition-opacity text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-foreground/40 ${task.completed ? "line-through opacity-50" : ""
                    //   }`}
                    placeholder="عنوان المهمة"
                  />
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Close button */}
          <button
            onClick={setIsOpen}
            className="absolute top-4 right-4 rounded-full p-2 hover:bg-slate-200 dark:hover:bg-foreground/10 transition-colors"
          >
            <TbX size={20} className="text-slate-600 dark:text-foreground/60" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-6 bg-white dark:bg-background">
          {/* Description section */}
          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-slate-700 dark:text-foreground/70 flex items-center gap-2"
            >
              <span className="w-1 h-4 bg-slate-400 dark:bg-foreground/40 rounded-full"></span>
              الوصف
            </Label>
            <div className="relative">
              <textarea
                id="description"
                defaultValue={task.description}
                onChange={(e) =>
                  updateTask(task.id, { description: e.target.value })
                }
                className="min-h-[140px] resize-none rounded-xl border border-slate-200 dark:border-foreground/10 w-full p-4 outline-none focus:border-slate-400 dark:focus:border-foreground/30 focus:ring-4 focus:ring-slate-100 dark:focus:ring-foreground/5 bg-slate-50 dark:bg-muted/30 transition-all placeholder:text-slate-400 dark:placeholder:text-foreground/40 text-slate-900 dark:text-foreground"
                placeholder="أضف وصف للمهمة..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-foreground/40 pointer-events-none">
                اضغط للتعديل
              </div>
            </div>
          </div>

          {/* Metadata section */}
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-muted/50 rounded-xl border border-slate-200 dark:border-foreground/10">
            <TbCalendar size={18} className="text-slate-500 dark:text-foreground/50" />
            <p className="text-sm text-slate-600 dark:text-foreground/60 font-medium">
              {formatArabicDate(task.createdAt)}
            </p>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="bg-slate-50 dark:bg-muted/30 backdrop-blur-sm p-4 flex items-center justify-between border-t border-slate-200 dark:border-foreground/10">
          <div className="flex gap-2">
            <Button
              onClick={() => deleteTask(task.id || "")}
              variant="ghost"
              className="hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all gap-2"
            >
              <TbTrash size={18} />
              <span className="hidden sm:inline">حذف المهمة</span>
            </Button>
          </div>

          <Button
            onClick={setIsOpen}
            className="bg-slate-900 dark:bg-foreground text-white dark:text-background hover:bg-slate-800 dark:hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
          >
            تم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};