"use client";

import useTasks from "@/hooks/useTasks";
import detectStartingLang from "@/utils/detectLang";
import { useState } from "react";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewTaskForm = () => {
  const { addTaks } = useTasks();

  const [inputValue, setInputValue] = useState<string>("");
  const [inputDirection, setInputDirection] = useState<"rtl" | "ltr">("rtl");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        onSubmit={handleSubmit}
        className="w-full flex items-center justify-center gap-3"
      >
        <Input
          dir={inputDirection}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="كتبت يبقا هتخلص 👀"
          type="text"
          className="w-full"
        />
        <Button 
          type="submit"
          size="icon"
          className="rounded-full  aspect-square text-2xl"
        >
          <FaPlus />
        </Button>
      </form>
    </motion.div>
  );
};

export default NewTaskForm;
