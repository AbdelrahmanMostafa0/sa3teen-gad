"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type FilterType = "all" | "active" | "completed";

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilters = ({ currentFilter, onFilterChange, counts }: TaskFiltersProps) => {
  return (
    <Tabs 
      value={currentFilter} 
      onValueChange={(value) => onFilterChange(value as FilterType)}
      variant="primary"
    >
      <TabsList>

        <TabsTrigger className="gap-3" value="completed">
          مكتمل
          <span className="mr-2 text-xs bg-gray-200/40 px-1.5 py-0.5 rounded-full">
            {counts.completed}
          </span>
        </TabsTrigger>
        
        <TabsTrigger className="gap-3" value="active">
          نشط
          <span className="mr-2 text-xs bg-gray-200/40 px-1.5 py-0.5 rounded-full">
            {counts.active}
          </span>
        </TabsTrigger>
        <TabsTrigger className="gap-3" value="all">
          الكل
          <span className="mr-2 text-xs bg-gray-200/40 px-1.5 py-0.5 rounded-full">
            {counts.all}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskFilters;