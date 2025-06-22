import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./../store/store";
import TaskType from "@/types/tasks";
import { setTasks } from "@/store/features/tasksSlice";
import { nanoid } from "nanoid";

const useTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.Tasks.tasks);
  const addTaks = (task: string) => {
    const newTask: TaskType = {
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
  const updateTask = (updatedTask: TaskType) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    dispatch(setTasks(updatedTasks));
  };
  return { addTaks, deleteTask, updateTask };
};
export default useTasks;
