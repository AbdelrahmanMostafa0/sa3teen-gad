import useTasks from "@/hooks/useTasks";
import detectStartingLang from "@/utils/detectLang";
import { useState } from "react";

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
  };
  return (
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
  );
};

export default NewTaskForm;
