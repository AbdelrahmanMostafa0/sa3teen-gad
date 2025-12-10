import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  getAllTasks,
  postTask,
  updateTask as updateTaskThunk,
  deleteTask as deleteTaskThunk,
} from "@/store/features/allTasksSlice";
import { ITask } from "@/types/tasks";
import { useEffect } from "react";
import { useUser } from "./useUser";

const useTasksActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useUser();
  const { hasFetched, tasks, loading } = useSelector(
    (state: RootState) => state.AllTasks
  );

  const fetchAllTasks = () => {
    dispatch(getAllTasks());
  };

  const createTask = (task: ITask) => {
    dispatch(postTask(task));
  };

  const updateTask = (id: string, changes: Partial<ITask>) => {
    dispatch(updateTaskThunk({ id, changes }));
  };

  const deleteTask = (id: string) => {
    dispatch(deleteTaskThunk(id));
  };

  useEffect(() => {
    if (!loading && !hasFetched && isAuthenticated) {
      dispatch(getAllTasks());
    }
  }, [loading, hasFetched, dispatch, isAuthenticated]);

  return {
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    loading,
    hasFetched,
    tasks,
  };
};

export default useTasksActions;
