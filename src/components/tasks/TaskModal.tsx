"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { TbTrash, TbX, TbCalendar, TbCheck } from "react-icons/tb";
import { ITask, ISubtask } from "@/types/tasks";
import { formatArabicDate } from "@/utils/date";
import detectStartingLang from "@/utils/detectLang";
import SubtaskManager from "./SubtaskManager";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogClose,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TaskModalProps {
    task: ITask;
    isOpen: boolean;
    setIsOpen: () => void;
    updateTask: (id: string, changes: Partial<ITask>) => void;
    deleteTask: (id: string) => void;
}

interface TaskFormData {
    title: string;
    description: string;
}

const TaskModal = ({
    task,
    isOpen,
    setIsOpen,
    updateTask,
    deleteTask,
}: TaskModalProps) => {
    const [localTask, setLocalTask] = useState<ITask>(task);
    const isArabic = detectStartingLang(localTask.title) === "arabic";
    const [checked, setChecked] = useState(task.completed);
    const taskId = task.id || (task as any)._id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TaskFormData>({
        defaultValues: {
            title: task.title,
            description: task.description || "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            setLocalTask(task);
            setValue("title", task.title);
            setValue("description", task.description || "");
        }
    }, [task, isOpen, setValue]);

    const handleCheckboxClick = (checked: boolean) => {
        if (!taskId) {
            console.error("Task ID is missing");
            return;
        }
        setChecked(checked);
        updateTask(taskId, { completed: checked });
    };

    const handleSubtasksChange = (subtasks: ISubtask[]) => {
        // Update local state
        setLocalTask({ ...localTask, subtasks });

        // Immediately save subtasks to backend/localStorage
        if (taskId) {
            updateTask(taskId, { subtasks });
        }
    };

    const onSave = (data: TaskFormData) => {
        if (!taskId) {
            console.error("Task ID is missing");
            return;
        }

        updateTask(taskId, {
            title: data.title.trim(),
            description: data.description.trim(),
        });
        setIsOpen();
    };

    const handleDelete = () => {
        if (!taskId) {
            console.error("Task ID is missing");
            return;
        }
        deleteTask(taskId);
        setIsOpen();
    };
    useEffect(() => {
        setChecked(task.completed);
    }, [task.completed])
    const formattedDate = task.createdAt
        ? formatArabicDate(
            typeof task.createdAt === "string"
                ? new Date(task.createdAt)
                : task.createdAt
        )
        : "";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                closeBtn={false}
                className="max-w-[95vw] md:max-w-[700px] border-0 p-0 gap-0 bg-white dark:bg-background/95 backdrop-blur-xl shadow-2xl max-h-[90vh] overflow-y-auto minimal-scrollbar"
            >
                <div className="sticky top-0 z-10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-foreground/5 dark:to-foreground/10 border-b border-slate-200 dark:border-foreground/10">
                    <DialogHeader>
                        <DialogTitle className="sr-only">تعديل المهمة</DialogTitle>
                        <div dir={isArabic ? "rtl" : "ltr"} className="p-6 pb-5">
                            <div className="flex items-center gap-3">
                                {/* Custom checkbox with animation */}
                                <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleCheckboxClick(!checked)}
                                    className={`flex-shrink-0 h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${checked
                                            ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/20"
                                            : "border-slate-300 dark:border-foreground/30 hover:border-slate-400 dark:hover:border-foreground/50 hover:bg-slate-100 dark:hover:bg-foreground/5"
                                        }`}
                                >
                                    <AnimatePresence>
                                        {checked && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <TbCheck
                                                    className="text-white"
                                                    size={20}
                                                    strokeWidth={3}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                {/* Title input with validation */}
                                <div className="flex-1 min-w-0">
                                    <Input
                                        {...register("title", {
                                            required: "لازم تكتب عنوان للمهمة",
                                            maxLength: {
                                                value: 500,
                                                message: "العنوان طويل جداً (حد أقصى 500 حرف)",
                                            },
                                        })}
                                        placeholder="عنوان المهمة"
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
                                <DialogClose asChild>
                                    <button
                                        type="button"
                                        className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-foreground/10 transition-colors"
                                    >
                                        <TbX
                                            size={20}
                                            className="text-slate-600 dark:text-foreground/60"
                                        />
                                    </button>
                                </DialogClose>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6 bg-white dark:bg-background">
                    {/* Description section */}
                    {/* <div className="space-y-3">
                        <Label
                            htmlFor="description"
                            className="text-sm font-semibold text-slate-700 dark:text-foreground/70 flex items-center gap-2"
                        >
                            <span className="w-1 h-4 bg-slate-400 dark:bg-foreground/40 rounded-full"></span>
                            الوصف
                        </Label>
                        <div className="relative">
                            <textarea
                                id="description"
                                {...register("description", {
                                    maxLength: {
                                        value: 2000,
                                        message: "الوصف طويل جداً (حد أقصى 2000 حرف)",
                                    },
                                })}
                                className={`min-h-[140px] resize-none rounded-xl border w-full p-4 outline-none focus:border-slate-400 dark:focus:border-foreground/30 focus:ring-4 focus:ring-slate-100 dark:focus:ring-foreground/5 bg-slate-50 dark:bg-muted/30 transition-all placeholder:text-slate-400 dark:placeholder:text-foreground/40 text-slate-900 dark:text-foreground ${errors.description
                                    ? "border-red-500"
                                    : "border-slate-200 dark:border-foreground/10"
                                    }`}
                                placeholder="أضف وصف للمهمة..."
                            />
                            {errors.description && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-xs mt-1"
                                >
                                    {errors.description.message}
                                </motion.p>
                            )}
                        </div>
                    </div> */}

                    {/* Subtasks section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-foreground/70 flex items-center gap-2">
                            <span className="w-1 h-4 bg-slate-400 dark:bg-foreground/40 rounded-full"></span>
                            المهام الفرعية
                        </Label>

                        {/* Progress Bar - Only show if there are subtasks */}
                        {localTask.subtasks && localTask.subtasks.length > 0 && (
                            <div className="space-y-2 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-foreground/5 dark:to-foreground/10 rounded-xl border border-slate-200 dark:border-foreground/10">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700 dark:text-foreground/80">
                                        التقدم
                                    </span>
                                    <span className="text-slate-600 dark:text-foreground/60 font-semibold">
                                        {localTask.subtasks.filter((st) => st.done).length} /{" "}
                                        {localTask.subtasks.length}
                                    </span>
                                </div>
                                <div className="relative h-2 bg-slate-200 dark:bg-foreground/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(localTask.subtasks.filter((st) => st.done).length /
                                                    localTask.subtasks.length) *
                                                100
                                                }%`,
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-foreground/50 text-center">
                                    {Math.round(
                                        (localTask.subtasks.filter((st) => st.done).length /
                                            localTask.subtasks.length) *
                                        100
                                    )}
                                    % مكتمل
                                </p>
                            </div>
                        )}

                        <SubtaskManager
                            subtasks={localTask.subtasks || []}
                            onChange={handleSubtasksChange}
                        />
                    </div>

                    {/* Metadata section */}
                    {formattedDate && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-muted/50 rounded-xl border border-slate-200 dark:border-foreground/10">
                            <TbCalendar
                                size={18}
                                className="text-slate-500 dark:text-foreground/50"
                            />
                            <p className="text-sm text-slate-600 dark:text-foreground/60 font-medium">
                                <span className="font-semibold ml-1">تاريخ الإنشاء:</span>
                                {formattedDate}
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-slate-50 dark:bg-muted/30 backdrop-blur-sm p-4 flex items-center justify-between border-t border-slate-200 dark:border-foreground/10">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={handleDelete}
                            variant="ghost"
                            className="hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all gap-2"
                        >
                            <TbTrash size={18} />
                            <span className="hidden sm:inline">حذف المهمة</span>
                        </Button>
                    </div>

                    <Button
                        type="button"
                        onClick={handleSubmit(onSave)}
                        className="bg-slate-900 dark:bg-foreground text-white dark:text-background hover:bg-slate-800 dark:hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
                    >
                        تم
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TaskModal;
