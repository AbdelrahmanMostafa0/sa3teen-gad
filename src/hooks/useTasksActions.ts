import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAllTasks, postTask } from "@/store/features/allTasksSlice";
import { ITask } from "@/types/tasks";
import { useEffect, useState } from "react";

const useTasksActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hasFetched, tasks, loading } = useSelector(
    (state: RootState) => state.AllTasks
  );
  const fetchAllTasks = () => {
    dispatch(getAllTasks()); // Call the thunk creator with ()
  };

  const createTask = (task: ITask) => {
    dispatch(postTask(task)); // Call the thunk creator with ()
    // setAllTasks([...tasks, task]);
  };

  useEffect(() => {
    if (!loading && !hasFetched) {
      dispatch(getAllTasks());
      //   setAllTasks(tasks);
    }
  }, [loading, hasFetched, dispatch]);
  //   useEffect(() => {
  //     setAllTasks(tasks || []);
  //   }, [tasks]);
  return {
    fetchAllTasks,
    createTask,
    loading,
    hasFetched,
    tasks,
  };
};

export default useTasksActions;
