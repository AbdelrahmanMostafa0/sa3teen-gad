"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type FilterType = "all" | "active" | "completed";

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;

}

const TaskFilters = ({ currentFilter, onFilterChange }: TaskFiltersProps) => {
  return (
    <Tabs
      value={currentFilter}
      onValueChange={(value) => onFilterChange(value as FilterType)}
      variant="primary"
    >
      <TabsList>

        <TabsTrigger className="gap-3" value="completed">
          مكتمل

        </TabsTrigger>

        <TabsTrigger className="gap-3" value="active">
          نشط

        </TabsTrigger>
        <TabsTrigger className="gap-3" value="all">
          الكل

        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TaskFilters;