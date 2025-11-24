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

const TaskCard = ({ task }: { task: TaskType }) => {
  const {
    isArabic,
    isOpen,
    handleModalToggle,
    handleCheckboxClick,
    pathLength,
    taskCompleted,
  } = useTaskCardLogic(task);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`bg-white p-4 rounded-lg shadow-md mb-2 w-full flex items-center justify-between relative ${
        taskCompleted ? "opacity-50" : ""
      }`}
    >
      <svg
        width="804"
        height="21"
        viewBox="0 0 804 21"
        fill="none"
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[103%] h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M799.687 6.07037C798.09 6.07037 782.493 6.07037 754.719 7.26821C741.676 7.83075 730.938 10.8617 719.595 12.0958C696.774 14.5787 683.545 12.9307 681.53 11.7268C680.546 11.1387 680.314 9.72438 679.51 8.90767C677.866 7.23879 667.489 9.2767 634.615 12.9005C610.616 15.5459 571.396 15.7257 550.64 16.1431C529.883 16.5605 528.685 16.1612 491.335 15.7559C453.984 15.3506 380.517 14.9513 341.272 14.546C299.228 14.1117 295.156 13.33 292.742 12.9307C291.479 12.7218 290.328 11.7329 274.938 11.3215C259.547 10.9101 230.001 10.9101 213.183 10.7105C184.673 10.372 170.956 8.90162 161.682 8.68988C151.176 8.45002 135.868 8.10306 123.399 5.27181C110.892 2.43169 101.566 5.25972 99.1524 6.06432C96.7386 6.86893 75.5405 7.28031 44.4936 6.88103C24.578 4.86044 11.6317 5.65899 8.61295 6.86893C7.19128 7.28031 5.99344 7.28031 4.75931 7.28031"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (1000 * pathLength) / 100}
        />
      </svg>

      <button
        onClick={handleModalToggle}
        className="text-lg text-start font-semibold w-full relative z-10"
      >
        {task.title}
      </button>
      <div className="flex items-center gap-2 relative">
        <Checkbox
          checked={taskCompleted}
          onCheckedChange={handleCheckboxClick}
          className="h-7 w-7"
        />
      </div>
      <TaskModal task={task} isOpen={isOpen} setIsOpen={handleModalToggle} />
    </div>
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
      <DialogContent className="max-w-[95vw] md:max-w-[700px]">
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
              className="border-b border-gray-200 rounded-none border-x-0 border-t-0 px-0"
            />
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold">
              الوصف
            </Label>
            <textarea
              id="description"
              defaultValue={task.description}
              onChange={(e) =>
                updateTask(task.id, { description: e.target.value })
              }
              className="h-[120px] resize-none rounded-lg border w-full border-gray-200 p-3 outline-none"
            />
          </div>
          
          <div className="bg-gray-200 p-4 -mx-6 -mb-6 flex items-center justify-between rounded-b-lg">
            <p>{formatArabicDate(task.createdAt)}</p>
            <Button
              onClick={() => deleteTask(task.id || "")}
              variant="destructive"
              size="icon"
            >
              <TbTrash size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
