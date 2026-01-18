export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
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
  nextTaskId?: string;
  subtasks?: ISubtask[];
  userId?: string;
  completed?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// export const  rangeType ="all_time"  as const "all_time" | "today" | "week" | "month";
