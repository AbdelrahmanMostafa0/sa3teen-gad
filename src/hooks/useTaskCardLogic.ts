import { useEffect, useRef, useState } from "react";
import useTasks from "@/hooks/useTasks";
import detectStartingLang from "@/utils/detectLang";
import { ITask } from "@/types/tasks";

export const useTaskCardLogic = (task: ITask) => {
  const pencilRef = useRef<HTMLAudioElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { updateTask } = useTasks();
  const isArabic = detectStartingLang(task.title) === "arabic";

  useEffect(() => {
    pencilRef.current = new Audio("/sound/pencil-sound.mp3");
    return () => {
      pencilRef.current?.pause();
      pencilRef.current = null;
    };
  }, []);

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

    if (task.completed && hasInteracted) {
      pencilRef.current?.play();
    } else {
      setPathLength(0);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [task.completed, hasInteracted]);

  const handleCheckboxClick = () => {
    if (!hasInteracted) setHasInteracted(true);
    updateTask(task.id!, { completed: !task.completed });
  };

  const handleModalToggle = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsOpen((prev) => !prev);
  };

  return {
    isArabic,
    isOpen,
    handleModalToggle,
    handleCheckboxClick,
    pathLength,
    taskCompleted: task.completed,
  };
};

export default useTaskCardLogic;
