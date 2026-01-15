export interface TaskType {
  _id: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
  dueDate?: string; // Optional due date
  priority?: "low" | "medium" | "high"; // Optional priority level
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
  subtasks?: ISubtask[];
  userId?: string;
  completed?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
