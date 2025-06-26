import detectStartingLang from "@/utils/detectLang";
import { TaskType } from "@/types/tasks";
import { TbTrash } from "react-icons/tb";
import useTasks from "@/hooks/useTasks";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Modal from "../ui/Modal";
import { formatArabicDate } from "@/utils/date";
import useTaskCardLogic from "@/hooks/useTaskCardLogic";

const TaskCard = ({ task }: { task: TaskType }) => {
  const {
    isArabic,
    isOpen,
    handleModalToggle,
    handleCheckboxClick,
    pathLength,
    taskCompleted,
  } = useTaskCardLogic(task);

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`bg-white p-4 rounded-lg shadow-md mb-2 w-full flex items-center justify-between relative ${
        taskCompleted ? "opacity-50" : ""
      }`}
    >
      <svg
        width="804"
        height="21"
        viewBox="0 0 804 21"
        fill="none"
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[103%] h-full opacity-70 `"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M799.687 6.07037C798.09 6.07037 782.493 6.07037 754.719 7.26821C741.676 7.83075 730.938 10.8617 719.595 12.0958C696.774 14.5787 683.545 12.9307 681.53 11.7268C680.546 11.1387 680.314 9.72438 679.51 8.90767C677.866 7.23879 667.489 9.2767 634.615 12.9005C610.616 15.5459 571.396 15.7257 550.64 16.1431C529.883 16.5605 528.685 16.1612 491.335 15.7559C453.984 15.3506 380.517 14.9513 341.272 14.546C299.228 14.1117 295.156 13.33 292.742 12.9307C291.479 12.7218 290.328 11.7329 274.938 11.3215C259.547 10.9101 230.001 10.9101 213.183 10.7105C184.673 10.372 170.956 8.90162 161.682 8.68988C151.176 8.45002 135.868 8.10306 123.399 5.27181C110.892 2.43169 101.566 5.25972 99.1524 6.06432C96.7386 6.86893 75.5405 7.28031 44.4936 6.88103C24.578 4.86044 11.6317 5.65899 8.61295 6.86893C7.19128 7.28031 5.99344 7.28031 4.75931 7.28031"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={1000 - (1000 * pathLength) / 100}
        />
      </svg>

      <button
        onClick={handleModalToggle}
        className="text-lg text-start font-semibold w-full relative z-10"
      >
        {task.title}
      </button>
      <div className="flex items-center gap-2 relative ">
        <button className="text-3xl" onClick={handleCheckboxClick}>
          {taskCompleted ? (
            <MdCheckBox className="text-green-500" />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </button>
      </div>
      <TaskModal task={task} isOpen={isOpen} setIsOpen={handleModalToggle} />
    </div>
  );
};

export default TaskCard;

type TaskModalProps = {
  task: TaskType;
  isOpen: boolean;
  setIsOpen: () => void;
};
const TaskModal = ({ task, isOpen, setIsOpen }: TaskModalProps) => {
  const { deleteTask, updateTask } = useTasks();
  const isArabic = detectStartingLang(task.title) === "arabic";
  const handleCheckboxClick = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div dir={isArabic ? "rtl" : "ltr"} className="flex items-end gap-3">
        <button className="text-3xl" onClick={handleCheckboxClick}>
          {task.completed ? (
            <MdCheckBox className="text-green-500" />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </button>
        <input
          onChange={(e) => updateTask(task.id, { title: e.target.value })}
          defaultValue={task.title}
          className="w-full border-b border-gray-200 py-2 outline-none "
        />
      </div>
      <p className="font-bold">الوصف</p>
      <textarea
        defaultValue={task.description}
        onChange={(e) => updateTask(task.id, { description: e.target.value })}
        name=""
        id=""
        className="h-[120px] resize-none rounded-lg border w-full border-gray-200 p-3 outline-none "
      ></textarea>
      {/* <h5>{task.title}</h5> */}
      <div className="bg-gray-200 p-4 -mx-5 flex items-center justify-between">
        <p> {formatArabicDate(task.createdAt)}</p>
        <button
          onClick={() => deleteTask(task.id || "")}
          className="text-red-500 flex  items-center cursor-pointer justify-center"
        >
          <TbTrash size={25} />
        </button>
      </div>
    </Modal>
  );
};
