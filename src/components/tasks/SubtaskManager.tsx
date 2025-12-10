"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { ISubtask } from "@/types/tasks";
import { TbPlus, TbTrash, TbCheck } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// MongoDB will generate _id for subtasks when saved

interface SubtaskManagerProps {
    subtasks: ISubtask[];
    onChange: (subtasks: ISubtask[]) => void;
}

interface SubtaskFormData {
    title: string;
}

const SubtaskManager = ({ subtasks, onChange }: SubtaskManagerProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SubtaskFormData>({
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = (data: SubtaskFormData) => {
        if (data.title.trim()) {
            const newSubtask: ISubtask = {
                title: data.title.trim(),
                done: false,
            };
            onChange([newSubtask, ...subtasks]);
            reset();
        }
    };

    const toggleSubtask = (index: number) => {
        onChange(
            subtasks.map((st, i) =>
                i === index ? { ...st, done: !st.done } : st
            )
        );
    };

    const deleteSubtask = (index: number) => {
        onChange(subtasks.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <div className="flex-1">
                    <Input
                        {...register("title", {
                            required: "لازم تكتب حاجة",
                            minLength: {
                                value: 1,
                                message: "لازم تكتب حاجة",
                            },
                        })}
                        placeholder="أضف مهمة فرعية..."
                        className={`h-10 text-sm ${errors.title ? "border-red-500" : ""
                            }`}
                    />
                    {errors.title && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-xs mt-1"
                        >
                            {errors.title.message}
                        </motion.p>
                    )}
                </div>
                <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 rounded-lg"
                >
                    <TbPlus size={18} />
                </Button>
            </form>
            <div className="space-y-2 ">
                {subtasks.map((subtask, index) => (
                    <div
                        key={subtask._id || index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-muted/30 border border-slate-200 dark:border-foreground/10 group"
                    >
                        <Checkbox
                            checked={subtask.done}
                            onCheckedChange={() => toggleSubtask(index)}
                            className="h-5 w-5"
                        />
                        <span
                            className={`flex-1 text-sm transition-all ${subtask.done
                                ? "line-through text-slate-400 dark:text-foreground/40"
                                : "text-slate-700 dark:text-foreground/80"
                                }`}
                        >
                            {subtask.title}
                        </span>
                        <button
                            type="button"
                            onClick={() => deleteSubtask(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500"
                        >
                            <TbTrash size={16} />
                        </button>
                    </div>
                ))}

                {subtasks.length === 0 && (
                    <div className="text-center py-6 text-sm text-slate-400 dark:text-foreground/40">
                        مفيش مهام فرعية حالياً
                    </div>
                )}
            </div>


        </div>
    );
};

export default SubtaskManager;
