import detectStartingLang from "@/utils/detectLang";
import { TaskType } from "@/types/tasks";
import { TbTrash } from "react-icons/tb";
import useTasks from "@/hooks/useTasks";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";

const TaskCard = ({ task }: { task: TaskType }) => {
  const pencilRef = useRef<HTMLAudioElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // New state
  const { deleteTask, updateTask } = useTasks();
  const isArabic = detectStartingLang(task.title) === "arabic";

  // Initialize audio only once on mount
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

      if (task.completed) {
        setPathLength(progress * 100);
      } else {
        setPathLength(0);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (task.completed) {
      // Only play sound if user has interacted
      if (hasInteracted) {
        pencilRef.current?.play();
      }
      animationFrame = requestAnimationFrame(animate);
    } else {
      setPathLength(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [task.completed, hasInteracted]); // Add hasInteracted to dependencies

  // Update the checkbox click handler to set hasInteracted
  const handleCheckboxClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    updateTask({ ...task, completed: !task.completed });
  };

  // Update the modal open handler to set hasInteracted
  const handleModalToggle = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      key={task.id}
      className={`bg-white p-4 rounded-lg shadow-md mb-2 w-full flex items-center justify-between relative ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      {/* <svg
        width="450"
        height="47"
        viewBox="0 0 450 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full opacity-60"
      >
        <path
          d="M4 32.9705C6.40777 24.5372 11.6347 12.0507 16.4684 5.58361C23.3439 -3.61531 26.9646 30.115 30.0015 33.5755C32.609 36.5465 40.2376 21.343 49.911 11.4578C53.2775 8.01768 54.7931 9.15897 55.8094 10.3689C56.8258 11.5788 57.6243 13.1759 58.6346 13.5994C64.274 15.9633 72.9179 6.76329 78.9978 7.35011C89.0642 8.32169 95.5195 23.2547 100.958 28.4998C102.964 30.4342 104.4 29.7521 105.417 28.9475C111.135 24.4203 118.895 14.4585 127.988 9.18921C129.724 8.18303 131.019 7.97323 132.634 8.96538C143.063 15.371 146.337 31.7122 153.802 36.5942C160.414 40.9182 165.696 23.7266 172.961 19.0683C174.427 18.129 175.787 18.4513 177.202 19.4495C185.862 25.5557 191.104 37.3746 196.543 41.6155C202.08 45.9328 209.665 36.2131 218.528 33.3819C221.635 32.389 224.196 33.769 228.007 32.9826C236.475 31.2353 241.123 21.6939 245.352 19.0744C247.136 17.9691 248.383 17.6527 250.198 19.0441C252.012 20.4356 254.408 23.6298 256.441 24.4767C262.955 27.1911 266.532 16.8542 274.989 13.0187C277.274 11.9824 279.817 12.4016 281.65 13.2001C285.192 14.7431 287.113 18.0399 289.527 19.0502C294.294 21.0456 298.801 14.8215 302.424 15.2207C312.656 16.3481 320.18 30.9499 323.798 31.5549C328.158 32.284 333.877 26.9692 340.138 22.2868C342.674 20.3905 345.19 26.5094 347.603 27.7194C348.751 28.2946 350.017 28.1307 350.834 27.5318C352.583 26.2488 353.26 23.3031 355.268 22.4864C356.443 22.0086 358.075 24.8639 359.497 25.8924C360.919 26.9208 362.117 26.9208 363.333 26.3219C366.032 24.9923 368.178 22.4924 370.991 21.2825C379.693 17.5399 392.341 30.5264 409.848 33.769C423.857 36.3636 433.914 32.5833 436.733 29.5645C437.955 28.1428 438.754 26.945 439.764 26.5276C440.774 26.1102 441.972 26.5094 445.626 26.9208"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1000" // Approximate total path length
          strokeDashoffset={1000 - (1000 * pathLength) / 100}
        />
      </svg> */}
      {/* <svg
        width="664"
        height="47"
        viewBox="0 0 664 47"
        fill="none"
        className="absolute top-0 left-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 25.8585C14.8531 14.1947 26.1418 5.31376 35.422 4.07358C45.3699 2.74418 46.3235 19.7483 50.7519 29.2221C52.4602 32.8767 54.3817 33.5053 57.6001 30.922C66.7496 23.5784 71.7443 14.9811 75.3559 12.3677C80.8004 8.42793 86.6628 7.70944 90.8794 9.30655C106.242 15.1255 110.45 26.657 115.296 26.8688C121.351 27.1333 132.181 21.4301 151.739 21.418C167.153 21.4085 178.569 33.8924 193.905 36.7418C199.134 37.7133 204.014 37.9578 209.647 36.5603C222.809 33.2945 226.58 18.2359 239.084 14.1705C247.176 11.5398 255.618 14.5819 264.305 12.9545C274.404 11.0628 291.045 30.19 300.416 35.1387C306.05 38.1141 310.101 27.4798 313.114 26.2698C322.539 22.4847 333.465 36.7237 340.138 41.9748C342.296 43.6728 347.186 40.4019 357.858 34.9511C376.71 25.3218 399.637 42.7976 401.851 41.999C407.66 39.9039 421.694 35.5379 432.299 34.3341C437.649 33.7267 443.182 33.9166 454.253 34.1284C462.205 34.2804 473.382 29.1253 484.308 25.0599C492.278 22.0944 497.23 23.4507 500.854 22.0351C506.03 20.0128 510.939 25.4471 515.984 26.4634C527.345 28.7519 543.607 26.2456 549.856 24.6546C559.316 22.2462 571.798 33.8924 587.128 38.5507C591.051 39.7427 595.174 39.1677 597.83 38.1695C602.398 36.4525 602.918 31.9202 603.716 30.1053C606.631 23.4806 631.013 34.3038 643.426 34.7394C645.061 34.7967 645.653 32.3437 646.863 31.7206C649.67 31.4968 653.711 31.9081 657.341 31.3092C658.575 30.7103 658.575 29.5125 659.785 27.0684"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1000" // Approximate total path length
          // strokeDashoffset={1000 - (1000 * pathLength) / 100}
          strokeDashoffset={
            isArabic
              ? (1000 * pathLength) / 100 - 1000
              : 1000 - (1000 * pathLength) / 100
          }
        />
      </svg> */}
      <svg
        width="804"
        height="21"
        viewBox="0 0 804 21"
        fill="none"
        className="absolute top-0 -right-3 w-[105%] h-full opacity-60 -10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M799.687 6.07037C798.09 6.07037 782.493 6.07037 754.719 7.26821C741.676 7.83075 730.938 10.8617 719.595 12.0958C696.774 14.5787 683.545 12.9307 681.53 11.7268C680.546 11.1387 680.314 9.72438 679.51 8.90767C677.866 7.23879 667.489 9.2767 634.615 12.9005C610.616 15.5459 571.396 15.7257 550.64 16.1431C529.883 16.5605 528.685 16.1612 491.335 15.7559C453.984 15.3506 380.517 14.9513 341.272 14.546C299.228 14.1117 295.156 13.33 292.742 12.9307C291.479 12.7218 290.328 11.7329 274.938 11.3215C259.547 10.9101 230.001 10.9101 213.183 10.7105C184.673 10.372 170.956 8.90162 161.682 8.68988C151.176 8.45002 135.868 8.10306 123.399 5.27181C110.892 2.43169 101.566 5.25972 99.1524 6.06432C96.7386 6.86893 75.5405 7.28031 44.4936 6.88103C24.578 4.86044 11.6317 5.65899 8.61295 6.86893C7.19128 7.28031 5.99344 7.28031 4.75931 7.28031"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1000" // Approximate total path length
          // strokeDashoffset={1000 - (1000 * pathLength) / 100}
          strokeDashoffset={1000 - (1000 * pathLength) / 100}
        />
      </svg>

      <button
        onClick={handleModalToggle}
        className="text-lg text-start font-semibold w-full relative z-10"
      >
        {task.title}
      </button>
      <div className="flex items-center gap-2 relative z-10">
        <button className="text-3xl" onClick={handleCheckboxClick}>
          {task.completed ? (
            <MdCheckBox className="text-green-500" />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </button>

        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <h5>{task.title}</h5>
          <button
            onClick={() => deleteTask(task.id || "")}
            className="bg-red-500 w-full py-2 rounded-xl justify-center text-white flex gap-2 items-center cursor-pointer"
          >
            <TbTrash /> حذف
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default TaskCard;
