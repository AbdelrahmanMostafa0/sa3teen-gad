import { ITask } from "@/types/tasks";
import { useState, useCallback } from "react";
import {
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "@/services/tasksApis";

interface UseTasksPageActionsProps {
  initialTasks?: ITask[];
  onTasksChange?: (tasks: ITask[]) => void;
}

const useTasksPageActions = ({
  initialTasks = [],
  onTasksChange,
}: UseTasksPageActionsProps = {}) => {
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [createLoading, setCreateLoading] = useState(false);

  const updateLocalTasks = useCallback(
    (newTasks: ITask[]) => {
      setTasks(newTasks);
      onTasksChange?.(newTasks);
    },
    [onTasksChange],
  );

  const createTask = async (taskData: Partial<ITask>) => {
    setCreateLoading(true);
    try {
      const newTask = await createTaskApi(taskData as ITask);

      // Add new task to the beginning of the list
      updateLocalTasks([newTask, ...tasks]);
      setCreateLoading(false);
      return newTask;
    } catch (error) {
      setCreateLoading(false);
      console.error("Error creating task:", error);
      throw error;
    }
  };

  const deleteTask = useCallback(
    async (id: string) => {
      const previousTasks = tasks;
      const optimisticTasks = tasks.filter(
        (task) => task.id !== id && (task as any)._id !== id,
      );
      updateLocalTasks(optimisticTasks);
      try {
        await deleteTaskApi(id);
      } catch (error) {
        updateLocalTasks(previousTasks);
        throw error;
      }
    },
    [tasks, updateLocalTasks],
  );

  const updateTask = useCallback(
    async (id: string, changes: Partial<ITask>) => {
      // Optimistic update
      const previousTasks = tasks;
      const optimisticTasks = tasks.map((task) =>
        task.id === id || (task as any)._id === id
          ? { ...task, ...changes }
          : task,
      );
      updateLocalTasks(optimisticTasks);

      try {
        const updatedTask = await updateTaskApi(id, changes);

        // Update with actual server response
        const finalTasks = tasks.map((task) =>
          task.id === id || (task as any)._id === id ? updatedTask : task,
        );
        updateLocalTasks(finalTasks);

        return updatedTask;
      } catch (error) {
        // Rollback on error
        console.error("Error updating task:", error);
        updateLocalTasks(previousTasks);
        throw error;
      }
    },
    [tasks, updateLocalTasks],
  );

  return {
    tasks,
    setTasks: updateLocalTasks,
    createTask,
    deleteTask,
    updateTask,
    createLoading,
  };
};

export default useTasksPageActions;
