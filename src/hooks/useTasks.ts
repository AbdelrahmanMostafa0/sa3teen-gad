import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./../store/store";
import { ITask } from "@/types/tasks";
import { setTasks } from "@/store/features/tasksSlice";
import { nanoid } from "nanoid";
import { useEffect } from "react";

const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.Tasks.tasks);

  const addTaks = (task: string) => {
    const newTask: ITask = {
      id: nanoid(),
      title: task,
      description: "",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    localStorage.setItem("tasks", JSON.stringify([newTask, ...existingTasks]));

    dispatch(setTasks([newTask, ...tasks]));
  };
  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    dispatch(setTasks(updatedTasks));
  };
  const updateTask = (id: string, changes: Partial<ITask>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...changes } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    dispatch(setTasks(updatedTasks));
  };
  const completedTasks = tasks.filter((task) => task.completed);
  const incompleteTasks = tasks.filter((task) => !task.completed);

  const clearCompleted = () => {
    const activeTasks = tasks.filter((task) => !task.completed);
    localStorage.setItem("tasks", JSON.stringify(activeTasks));
    dispatch(setTasks(activeTasks));
  };

  const markAllCompleted = () => {
    const updatedTasks = tasks.map((task) => ({ ...task, completed: true }));
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    dispatch(setTasks(updatedTasks));
  };

  return {
    addTaks,
    deleteTask,
    updateTask,
    clearCompleted,
    markAllCompleted,
    tasks,
    completedTasks,
    incompleteTasks,
  };
};
export default useTasks;
