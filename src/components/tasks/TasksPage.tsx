"use client";



import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TaskCard from "@/components/tasks/TaskCard";
import NewTaskForm from "@/components/tasks/NewTaskForm";
import TaskFilters, { FilterType } from "@/components/tasks/TaskFilters";
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { ITask } from "@/types/tasks";
import { Button } from "@/components/ui/button";

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>("all");
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });



    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/tasks", {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    filter: filter === "all" ? undefined : filter,
                },
            });
            setTasks(response.data.tasks);
            if (response.data.pagination) {
                setPagination(prev => ({ ...prev, ...response.data.pagination }));
            }

        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 min-h-screen">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">المهام</h1>
                    <p className="text-muted-foreground">نظم وقتك وشوف وراك إيه النهاردة</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Input Section */}
                <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FiCheckCircle className="text-primary" />
                        إضافة مهمة جديدة
                    </h2>
                    <NewTaskForm onSuccess={fetchTasks} />
                </div>

                {/* Filters & List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TaskFilters
                            currentFilter={filter}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <FiLoader className="text-3xl animate-spin text-primary" />
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <TaskCard key={task.id} task={task} />
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
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && tasks.length > 0 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="flex items-center gap-2"
                            >
                                <FiChevronRight />
                                السابق
                            </Button>

                            <span className="text-sm font-medium">
                                صفحة {pagination.page} من {pagination.totalPages}
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="flex items-center gap-2"
                            >
                                التالي
                                <FiChevronLeft />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
