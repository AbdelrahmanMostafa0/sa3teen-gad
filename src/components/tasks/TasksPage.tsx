"use client";

import { useState } from "react";
import useTasks from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import NewTaskForm from "@/components/tasks/NewTaskForm";
import TaskFilters, { FilterType } from "@/components/tasks/TaskFilters";
import BulkActions from "@/components/tasks/BulkActions";
import { FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

export default function TasksPage() {
    const { tasks, clearCompleted, markAllCompleted } = useTasks();
    const [filter, setFilter] = useState<FilterType>("all");

    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    const counts = {
        all: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 min-h-screen">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">المهام</h1>
                    <p className="text-muted-foreground">نظم وقتك وشوف وراك إيه النهاردة</p>
                </div>

                <BulkActions
                    onClearCompleted={clearCompleted}
                    onMarkAllCompleted={markAllCompleted}
                    hasCompletedTasks={counts.completed > 0}
                    hasActiveTasks={counts.active > 0}
                />
            </div>

            <div className="grid gap-6">
                {/* Input Section */}
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiCheckCircle className="text-primary" />
                        إضافة مهمة جديدة
                    </h2>
                    <NewTaskForm />
                </div>

                {/* Filters & List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TaskFilters
                            currentFilter={filter}
                            onFilterChange={setFilter}
                            counts={counts}
                        />
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <TaskCard key={task._id} task={task} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-16 px-4 border-2 border-dashed border-foreground/10 rounded-xl"
                                >
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-4 rounded-full bg-foreground/5">
                                            <FiCheckCircle className="text-5xl text-foreground/30" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground/70 mb-2">
                                        {filter === "all"
                                            ? "مفيش مهام حاليا"
                                            : filter === "active"
                                                ? "مفيش مهام نشطة"
                                                : "مفيش مهام مكتملة"}
                                    </h3>
                                    <p className="text-sm text-foreground/50">
                                        {filter === "all"
                                            ? "ابدأ بإضافة مهمة جديدة عشان تبدأ تنظم وقتك ☕"
                                            : filter === "active"
                                                ? "عاش يا بطل! خلصت كل اللي وراك 💪"
                                                : "لسه مخلصتش حاجة؟ شد حيلك 😉"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
