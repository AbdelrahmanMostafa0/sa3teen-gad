"use client";

import detectStartingLang from "@/utils/detectLang";
import { TaskType } from "@/types/tasks";
import { TbTrash } from "react-icons/tb";
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
import { motion } from "motion/react";

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
      className={`group relative bg-card border border-foreground/10 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-foreground/20 ${
        taskCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="relative flex items-center justify-between gap-4">
        <button
          onClick={handleModalToggle}
          className={`text-lg font-semibold flex-1 text-start transition-all duration-200 ${
            taskCompleted
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
      <DialogContent className="max-w-[95vw] md:max-w-[700px] border-foreground/20">
        <DialogHeader>
          <div dir={isArabic ? "rtl" : "ltr"} className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleCheckboxClick}
              className="h-7 w-7"
            />
            <Input
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              defaultValue={task.title}
              className="text-lg font-semibold border-0 border-b-2 border-foreground/20 rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground/50"
            />
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-foreground/70">
              الوصف
            </Label>
            <textarea
              id="description"
              defaultValue={task.description}
              onChange={(e) =>
                updateTask(task.id, { description: e.target.value })
              }
              className="h-[120px] resize-none rounded-lg border border-foreground/20 w-full p-3 outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 bg-background transition-all"
              placeholder="أضف وصف للمهمة..."
            />
          </div>
          
          <div className="bg-muted/50 p-4 -mx-6 -mb-6 flex items-center justify-between rounded-b-lg border-t border-foreground/10">
            <p className="text-sm text-foreground/60">{formatArabicDate(task.createdAt)}</p>
            <Button
              onClick={() => deleteTask(task.id || "")}
              variant="destructive"
              size="icon"
              className="hover:scale-105 transition-transform"
            >
              <TbTrash size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
