import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getAllTasks,
  postTask,
  updateTask as updateTaskThunk,
  deleteTask as deleteTaskThunk,
} from "@/store/features/allTasksSlice";
import { ITask } from "@/types/tasks";
import { useState, useCallback } from "react";

const useTasksActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const { hasFetched, tasks, loading } = useSelector(
    (state: RootState) => state.AllTasks
  );

  const fetchAllTasks = useCallback(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  const createTask = (task: ITask) => {
    setCreatePostLoading(true);
    dispatch(postTask(task));
    setCreatePostLoading(false);
  };

  const updateTask = (id: string, changes: Partial<ITask>) => {
    dispatch(updateTaskThunk({ id, changes }));
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
