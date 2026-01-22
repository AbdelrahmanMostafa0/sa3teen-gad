import { ITask } from "@/types/tasks";
import axios from "axios";

export const getIncompleteTasks = async ({
  page = 1,
  limit = 100,
}: {
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axios.get("/api/tasks/incompleted", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getCompletedTasks = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axios.get("/api/tasks/completed", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getTaskWithFilters = async () => {
  try {
    const response = await axios.get("/api/tasks");
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getAllTasks = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const response = await axios.get("/api/tasks/all", {
      params: {
        page,
        limit,
      },
    });
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

export const updateTaskOrder = async ({
  id,
  prevOrder,
  nextOrder,
}: {
  id: string;
  prevOrder: number | null | undefined;
  nextOrder: number | null | undefined;
}) => {
  try {
    const response = await axios.patch(`/api/tasks/reorder/${id}`, {
      prevOrder,
      nextOrder,
    });
    return response.data.task;
  } catch (err) {
    throw err;
  }
};
