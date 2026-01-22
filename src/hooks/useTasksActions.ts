import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getAllTasks,
  postTask,
  updateTask as updateTaskThunk,
  deleteTask as deleteTaskThunk,
  setTasks,
  removeTask,
} from "@/store/features/allTasksSlice";
import { ITask } from "@/types/tasks";
import { useState, useCallback } from "react";

const useTasksActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const { hasFetched, tasks, loading } = useSelector(
    (state: RootState) => state.AllTasks,
  );
  // const { homeTaskFilter } = useSelector((state: RootState) => state.Settings);
  const fetchAllTasks = useCallback(() => {
    dispatch(getAllTasks({ page: 1, limit: 100 }));
  }, [dispatch]);

  const createTask = async (task: ITask) => {
    setCreatePostLoading(true);
    try {
      const result = await dispatch(postTask(task)).unwrap();
      setCreatePostLoading(false);
      return result;
    } catch (error) {
      setCreatePostLoading(false);
      throw error;
    }
  };

  const updateTask = (id: string, changes: Partial<ITask>) => {
    console.log(
      "[useTasksActions] updateTask called with id:",
      id,
      "changes:",
      changes,
    );
    dispatch(updateTaskThunk({ id, changes }));
    if (changes.completed) {
      setTimeout(() => {
        console.log(
          "[useTasksActions] Timeout reached, dispatching removeTask for id:",
          id,
        );
        dispatch(removeTask(id));
      }, 1000);
    }
  };

  const deleteTask = (id: string) => {
    dispatch(deleteTaskThunk(id));
  };

  return {
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    loading,
    hasFetched,
    tasks,
    createPostLoading,
  };
};

export default useTasksActions;
