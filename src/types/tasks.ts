export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  tags?: string[]; // Optional tags for categorization
}

export interface ISubtask {
  _id?: string;
  title: string;
  done: boolean;
}

export interface ITask {
  id?: string;
  _id?: string;
  title: string;
  guestId?: string;
  description?: string;
  prevTaskId?: string;
  order?: number;
  nextTaskId?: string;
  subtasks?: ISubtask[];
  userId?: string;
  completed?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  completedAt?: Date | string;
}
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// export const  rangeType ="all_time"  as const "all_time" | "today" | "week" | "month";
