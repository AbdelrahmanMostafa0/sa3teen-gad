"use client";

import useTasks from "@/hooks/useTasks";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserTasks = () => {
  const { tasks } = useTasks();

  return (
    <Card className="w-full max-w-[700px] shadow-lg border-none bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-primary mb-2">
          <Image
            src={"/list-icon.png"}
            width={32}
            height={32}
            alt="list icon"
            className="drop-shadow-sm"
          />
          الكلام على إيه؟
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <NewTaskForm />
        
        <div className="w-full flex flex-col items-center space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground opacity-60">
              <p>مفيش مهام حاليا.. روق بالك ☕</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTasks;
