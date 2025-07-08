import useTasks from "@/hooks/useTasks";
import detectStartingLang from "@/utils/detectLang";
import { useState } from "react";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";

const NewTaskForm = () => {
  const { addTaks } = useTasks();

  const [inputValue, setInputValue] = useState<string>("");
  const [inputDirection, setInputDirection] = useState<"rtl" | "ltr">("rtl");

  const handleInputCange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setInputValue("");
    setInputDirection("rtl");
  };
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <form
        noValidate
        onSubmit={handleSubmt}
        className="w-full  flex items-center justify-center gap-3"
      >
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
        <button className="bg-slate-800 text-white  rounded-full w-14 aspect-square grid place-content-center text-2xl">
          <FaPlus />
        </button>
      </form>
    </motion.div>
  );
};

export default NewTaskForm;
