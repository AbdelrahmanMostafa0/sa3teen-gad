import detectStartingLang from "@/utils/detectLang";
import { TaskType } from "@/types/tasks";
import { TbTrash } from "react-icons/tb";
import useTasks from "@/hooks/useTasks";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useState } from "react";
import Modal from "../ui/Modal";
const TaskCard = ({ task }: { task: TaskType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteTask, updateTask } = useTasks();
  const isArabic = detectStartingLang(task.title) === "arabic";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      key={task.id}
      className="bg-white p-4 rounded-lg shadow-md mb-2  w-full flex items-center justify-between"
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-lg text-start font-semibold w-full"
      >
        {task.title}
      </button>
      <div className="flex items-center gap-2">
        <button
          className="text-3xl"
          onClick={() => updateTask({ ...task, completed: !task.completed })}
        >
          {task.completed ? (
            <MdCheckBox className="text-green-500" />
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </button>
        {/* <button
          onClick={() => deleteTask(task.id || "")}
          className="text-red-500 cursor-pointer"
        >
          <TbTrash />{" "}
        </button> */}

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
