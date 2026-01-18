import { useEffect, useState } from "react";
import detectStartingLang from "@/utils/detectLang";
import { ITask } from "@/types/tasks";

export const useTaskCardLogic = (task: ITask) => {
  const [pathLength, setPathLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const isArabic = detectStartingLang(task.title) === "arabic";

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 800;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setPathLength(task.completed ? progress * 100 : 0);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (task.completed) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [task.completed, hasInteracted]);

  const handleModalToggle = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsOpen((prev) => !prev);
  };

  return {
    isArabic,
    isOpen,
    handleModalToggle,
    pathLength,
    taskCompleted: task.completed,
  };
};

export default useTaskCardLogic;
