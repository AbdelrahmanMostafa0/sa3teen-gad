"use client";

// import useTasks from "@/hooks/";
import detectStartingLang from "@/utils/detectLang";
import { useState } from "react";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useTasks from "@/hooks/useTasks";

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
          className="flex-1 h-12 border-foreground/20 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-all"
        />
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          <FaPlus className="text-lg" />
        </Button>
      </form>
    </motion.div>
  );
};

export default NewTaskForm;