"use client";



import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters, { FilterType } from "@/components/tasks/TaskFilters";
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { ITask } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./CreateTaskForm";
import TaskPagination from "./render-tasks/TaskPagination";
import TaskCardSkeleton from "./TaskCardSkeleton";
import IncompletedTasks, { IncompletedTasksRef } from "./render-tasks/IncompletedTasks";
import AllTaks, { AllTaksRef } from "./render-tasks/AllTaks";
import CompletedTasks from "./render-tasks/CompletedTasks";
import useTasksActions from "@/hooks/useTasksActions";

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

    // Use Redux actions
    const { createTask, deleteTask, updateTask, createPostLoading } = useTasksActions();

    // Create refs for task list components
    const allTasksRef = useRef<AllTaksRef>(null);
    const incompletedTasksRef = useRef<IncompletedTasksRef>(null);

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleFilterChange = (newFilter: FilterType) => {
        setFilter(newFilter);
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const renderTaskCategory = useCallback(() => {
        switch (filter) {
            case "all":
                return <AllTaks ref={allTasksRef} createLoading={createPostLoading} />;
            case "active":
                return <IncompletedTasks ref={incompletedTasksRef} createLoading={createPostLoading} />;
            case "completed":
                return <CompletedTasks createLoading={createPostLoading} />;
        }
    }, [filter, createPostLoading]);
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
                    <CreateTaskForm
                        createTask={createTask}
                        setLoading={(loading) => { }}
                        onSuccess={(newTask) => {
                            // Add the new task to both AllTasks and IncompletedTasks
                            allTasksRef.current?.addTask(newTask);
                            incompletedTasksRef.current?.addTask(newTask);
                        }}
                    />
                </div>

                {/* Filters & List Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TaskFilters
                            currentFilter={filter}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {renderTaskCategory()}

                    {/* Pagination Controls */}
                    {!loading && pagination.totalPages > 1 && (
                        <TaskPagination
                            pagination={pagination}
                            handlePageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
