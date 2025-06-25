export interface TaskType {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt: string;
  updatedAt?: string;
  dueDate?: string; // Optional due date
  priority?: "low" | "medium" | "high"; // Optional priority level
  tags?: string[]; // Optional tags for categorization
}
