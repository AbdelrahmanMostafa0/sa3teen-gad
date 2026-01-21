import { ITask } from "@/types/tasks";
import axios from "axios";

export const getIncompleteTasks = async () => {
  try {
    const response = await axios.get("/api/tasks/incompleted");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getCompletedTasks = async () => {
  try {
    const response = await axios.get("/api/tasks/completed");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get("/api/tasks");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createTask = async (task: ITask) => {
  try {
    const response = await axios.post("/api/tasks", task);
    return response.data.task;
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (id: string, changes: Partial<ITask>) => {
  try {
    const response = await axios.patch(`/api/tasks/${id}`, changes);
    return response.data.task;
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
