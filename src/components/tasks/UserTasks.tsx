"use client";

import useTasks from "@/hooks/useTasks";

import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";

const UserTasks = () => {
  const { tasks } = useTasks();

  return (
    <div className="flex flex-col items-center justify-center  space-y-4 max-w-[700px] w-full px-3">
      <h2 className="text-2xl font-bold text-start w-full">الكلام على إيه؟</h2>
      <NewTaskForm />
      <div className="w-full flex flex-col items-center space-y-2">
        {tasks.length > 0
          ? tasks.map((task) => {
              return <TaskCard key={task.id} task={task} />;
            })
          : ""}
      </div>
    </div>
  );
};
export default UserTasks;
