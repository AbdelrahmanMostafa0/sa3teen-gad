"use client";

import useTasks from "@/hooks/useTasks";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";
import { FiCheckCircle } from "react-icons/fi";

const UserTasks = () => {
  const { tasks } = useTasks();

  return (
    <div className="w-full max-w-[700px]">
      {/* Header with minimal styling */}
      <div className="mb-6 rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-foreground/10">
              <FiCheckCircle className="text-foreground text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              الكلام على إيه؟
            </h2>
          </div>
          {/* <p className="text-sm text-foreground/60 mr-14">
            اكتب اللي عايز تخلصه وخلاص يا معلم 🎯
          </p> */}
        </div>
      </div>

      {/* New Task Form */}
      <div className="mb-6">
        <NewTaskForm />
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-16 px-4">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-foreground/5">
                <FiCheckCircle className="text-5xl text-foreground/30" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              مفيش مهام حاليا
            </h3>
            <p className="text-sm text-foreground/50">
              ابدأ بإضافة مهمة جديدة عشان تبدأ تنظم وقتك ☕
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTasks;
