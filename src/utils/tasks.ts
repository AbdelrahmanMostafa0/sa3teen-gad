import { ITask } from "@/types/tasks";

/**
 * Get the task that comes before the given task in the list
 */
export const getPrevTask = (tasks: ITask[], taskId: string): ITask | null => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex <= 0) return null;
  return tasks[taskIndex - 1];
};

/**
 * Get the task that comes after the given task in the list
 */
export const getNextTask = (tasks: ITask[], taskId: string): ITask | null => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1 || taskIndex >= tasks.length - 1) return null;
  return tasks[taskIndex + 1];
};

/**
 * Calculate the order value for a task being inserted between two positions
 */
export const calculateInsertOrder = (
  prevOrder: number | null,
  nextOrder: number | null,
): number => {
  if (prevOrder !== null && nextOrder !== null) {
    // Insert between two tasks: use midpoint
    return (prevOrder + nextOrder) / 2;
  } else if (prevOrder !== null) {
    // Insert at end (after prevTask)
    return prevOrder + 10000;
  } else if (nextOrder !== null) {
    // Insert at beginning (before nextTask)
    return nextOrder / 2;
  }
  // Only task in the list
  return 10000;
};
