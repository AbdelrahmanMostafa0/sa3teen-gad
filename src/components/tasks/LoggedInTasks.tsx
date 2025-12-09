
"use client";
import useTasksActions from "@/hooks/useTasksActions";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TaskCard from "./TaskCard";

const LoggedInTasks = () => {
  const { tasks, createTask } = useTasksActions()
  const [inputText, setInputText] = useState("")
  const addTask = (task: string) => {
    createTask({ title: task });
  }
  console.log(tasks);

  return <div>
    <Input onChange={(e) => setInputText(e.target.value)} value={inputText} />
    <Button onClick={() => addTask(inputText)}>Add Task</Button>
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ))}
  </div>;
};

export default LoggedInTasks;
