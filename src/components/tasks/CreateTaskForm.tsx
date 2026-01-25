"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import detectStartingLang from "@/utils/detectLang";
import { ITask } from "@/types/tasks";

interface TaskFormData {
    title: string;
}

interface CreateTaskFormProps {
    onSuccess?: (newTask: ITask) => void;
    setLoading?: (loading: boolean) => void;
    createTask?: (task: ITask) => Promise<any>;
}

const CreateTaskForm = ({ onSuccess, setLoading, createTask }: CreateTaskFormProps) => {
    const [inputDirection, setInputDirection] = useState<"rtl" | "ltr">("rtl");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<TaskFormData>({
        defaultValues: {
            title: "",
        },
    });

    const titleValue = watch("title");

    useEffect(() => {
        if (titleValue.trim() === "") {
            setInputDirection("rtl");
            return;
        }
        if (detectStartingLang(titleValue) === "arabic") {
            setInputDirection("rtl");
        } else {
            setInputDirection("ltr");
        }
    }, [titleValue]);

    const onSubmit = async (data: TaskFormData) => {
        console.log(data);
        if (data.title.trim() && createTask) {
            console.log("createTask");
            setLoading?.(true);
            const newTask = await createTask({ title: data.title.trim() } as ITask);
            if (onSuccess && newTask) onSuccess(newTask);
            reset();
            setInputDirection("rtl");
            setLoading?.(false);
        }
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
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex items-start justify-center gap-3"
            >
                <div className="flex-1">
                    <Input
                        dir={inputDirection}
                        {...register("title", {
                            required: "لازم تكتب حاجة يا معلم 🤔",
                            minLength: {
                                value: 3,
                                message: "لازم تكون 3 حروف على الأقل 📝",
                            },
                        })}

                        placeholder="كتبت يبقا هتخلص 👀"
                        type="text"
                        className={`h-12 border-foreground/20 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-all ${errors.title ? "border-red-500 focus-visible:ring-red-500/20" : ""
                            }`}
                    />
                    {errors.title && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm mt-3 mr-1"
                        >
                            {errors.title.message}
                        </motion.p>
                    )}
                </div>
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

export default CreateTaskForm;
