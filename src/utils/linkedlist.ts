type Task = {
  id: string;
  title: string;
  prevTaskId?: string | null;
  nextTaskId?: string | null;
};

export const sort = (tasks: Task[]) => {
  const map = new Map<string, Task>();
  tasks.forEach((task) => map.set(task.id, task));
  const head = tasks.find((task) => !task.prevTaskId);
  const tail = tasks.find((task) => !task.nextTaskId);
  let current = head;
  let sortedTasks: Task[] = [];
  while (current) {
    sortedTasks.push(current);
    current = map.get(current.nextTaskId!);
  }
  return sortedTasks;
};
