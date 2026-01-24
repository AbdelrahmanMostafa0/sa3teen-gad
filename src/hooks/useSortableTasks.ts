import { useState, useEffect } from "react";
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ITask } from "@/types/tasks";
import { updateTaskOrder } from "@/services/tasksApis";

type OrderApiState = "idle" | "loading" | "success" | "error";

interface UseSortableTasksOptions {
  tasks: ITask[];
  enabled?: boolean;
}

interface UseSortableTasksReturn {
  sortedTasks: ITask[];
  sensors: ReturnType<typeof useSensors>;
  orderApiState: OrderApiState;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
}

/**
 * Custom hook to manage sortable/draggable tasks with optimistic updates
 */
const useSortableTasks = ({
  tasks,
  enabled = true,
}: UseSortableTasksOptions): UseSortableTasksReturn => {
  const [sortedTasks, setSortedTasks] = useState<ITask[]>(tasks);
  const [orderApiState, setOrderApiState] = useState<OrderApiState>("idle");

  // Configure sensors for pointer and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Sync local state with external tasks
  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  /**
   * Handle drag end event - reorder tasks and persist to server
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    if (!enabled) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedTasks.findIndex((t) => t.id === active.id);
    const newIndex = sortedTasks.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Calculate the new array first to get correct neighbors
    const reorderedTasks = arrayMove(sortedTasks, oldIndex, newIndex);

    // Find prev and next orders based on the NEW position
    let prevOrder: number | null = null;
    let nextOrder: number | null = null;

    if (newIndex > 0) {
      prevOrder = reorderedTasks[newIndex - 1].order ?? null;
    }
    if (newIndex < reorderedTasks.length - 1) {
      nextOrder = reorderedTasks[newIndex + 1].order ?? null;
    }

    // Calculate new order based on neighbors (same logic as server)
    let newOrder: number;
    if (prevOrder !== null && nextOrder !== null) {
      // Insert between two tasks: use midpoint
      newOrder = (prevOrder + nextOrder) / 2;
    } else if (nextOrder !== null) {
      // Insert at end (after prevTask)
      newOrder = nextOrder + 10000;
    } else if (prevOrder !== null) {
      // Insert at beginning (before nextTask)
      newOrder = prevOrder / 2;
    } else {
      // Only task in the list
      newOrder = 10000;
    }

    // Update the dragged task's order locally
    const updatedTasks = reorderedTasks.map((task) =>
      task.id === active.id ? { ...task, order: newOrder } : task,
    );

    // Optimistic update - immediately reflect the change in UI with updated order
    setSortedTasks(updatedTasks);
    setOrderApiState("loading");

    try {
      await updateTaskOrder({
        id: active.id as string,
        prevOrder,
        nextOrder,
      });
      setOrderApiState("success");
    } catch (error) {
      // Revert to original order on error
      console.error("Failed to update task order:", error);
      setSortedTasks(tasks);
      setOrderApiState("error");
    } finally {
      // Reset state after a short delay
      setTimeout(() => setOrderApiState("idle"), 500);
    }
  };

  return {
    sortedTasks,
    sensors,
    orderApiState,
    handleDragEnd,
  };
};

export default useSortableTasks;
