"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbTrash, TbCheck } from "react-icons/tb";

interface BulkActionsProps {
  onClearCompleted: () => void;
  onMarkAllCompleted: () => void;
  hasCompletedTasks: boolean;
  hasActiveTasks: boolean;
}

const BulkActions = ({ 
  onClearCompleted, 
  onMarkAllCompleted,
  hasCompletedTasks,
  hasActiveTasks 
}: BulkActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  size="icon" className="h-9 w-9">
          <TbDots className="text-lg" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={onMarkAllCompleted}
          disabled={!hasActiveTasks}
          className="gap-2 cursor-pointer"
        >
          <TbCheck className="text-lg" />
          تحديد الكل كمكتمل
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onClearCompleted}
          disabled={!hasCompletedTasks}
          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <TbTrash className="text-lg" />
          حذف المهام المكتملة
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BulkActions;
