"use client";

import useTasks from "@/hooks/useTasks";
import { setTasks } from "@/store/features/tasksSlice";
import { AppDispatch, RootState } from "@/store/store";
import detectStartingLang from "@/utils/detectLang";
import { useEffect, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

const UserTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      dispatch(setTasks(parsedTasks));
    }
  }, [dispatch]);
  const { addTaks, deleteTask } = useTasks();
  const [inputValue, setInputValue] = useState<string>("");
  const [inputDirection, setInputDirection] = useState<"rtl" | "ltr">("rtl");
  const tasks = useSelector((state: RootState) => state.Tasks.tasks);
  const handleInputCange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input Value:", e.target.value);
    if (e.target.value.trim() === "") {
      setInputDirection("rtl");
      setInputValue("");
      return;
    }
    if (detectStartingLang(e.target.value) === "arabic") {
      setInputDirection("rtl");
    } else {
      setInputDirection("ltr");
    }

    setInputValue(e.target.value);
  };
  const handleSubmt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    addTaks(inputValue);
  };
  return (
    <div className="flex flex-col items-center justify-center  space-y-4 max-w-[700px] w-full">
      <h2 className="text-2xl font-bold text-start w-full">الكلام على إيه؟</h2>
      <form noValidate onSubmit={handleSubmt} className="w-full space-y-4">
        <input
          dir={inputDirection}
          value={inputValue}
          onChange={handleInputCange}
          placeholder="كتبت يبقا هتخلص 👀"
          type="text"
          name=""
          id=""
          className="w-full border-2 rounded-lg p-3  bg-white outline-none"
        />
        <button className="bg-slate-800 text-white py-2 px-4 rounded-lg w-full">
          ودى
        </button>
      </form>
      <div className="w-full flex flex-col items-center space-y-2">
        {tasks.length > 0
          ? tasks.map((task) => {
              if (!task.title) return null;
              const isArabic = detectStartingLang(task.title) === "arabic";
              return (
                <div
                  dir={isArabic ? "rtl" : "ltr"}
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-md mb-2  w-full flex items-center justify-between"
                >
                  <div className="">
                    <h3 className="text-lg font-semibold w-full">
                      {task.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id || "")}
                    className="text-red-500 cursor-pointer"
                  >
                    <TbTrash />{" "}
                  </button>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};
export default UserTasks;
