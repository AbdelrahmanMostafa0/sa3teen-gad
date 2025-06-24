"use client";

import useTasks from "@/hooks/useTasks";

import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";
import Image from "next/image";

const UserTasks = () => {
  const { tasks } = useTasks();

  return (
    <div className="flex flex-col items-center justify-center  space-y-4 max-w-[700px] w-full px-3">
      <div className="flex items-center gap-2 justify-start w-full">
        <Image
          src={"/list-icon.png"}
          width={40}
          height={40}
          alt="list icon"
          className="drop-shadow"
        />
        <h2 className="text-2xl font-bold text-start w-full">
          الكلام على إيه؟
        </h2>
      </div>
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
