import { ITask, PaginationData } from '@/types/tasks';
import { useCallback, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { getAllTasks } from '@/services/tasksApis';
import { AnimatePresence, motion } from 'motion/react';
import TaskCard from '../TaskCard';
import TaskLoadingList from './TaskLoadingList';
import TaskCardSkeleton from '../TaskCardSkeleton';
import { FiCheckCircle } from 'react-icons/fi';
import useTasksActions from '@/hooks/useTasksActions';

interface AllTaksProps {
    createLoading?: boolean;
}

export interface AllTaksRef {
    addTask: (task: ITask) => void;
}

const AllTaks = forwardRef<AllTaksRef, AllTaksProps>(({ createLoading }, ref) => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const onDelete = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    }

    const addTask = useCallback((newTask: ITask) => {
        setTasks(prevTasks => [newTask, ...prevTasks]);
    }, []);

    useImperativeHandle(ref, () => ({
        addTask
    }), [addTask]);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllTasks({
                page: pagination.page,
                limit: pagination.limit,
            });
            setTasks(response.tasks);
            setPagination(response.pagination);
            setHasFetched(true);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, setTasks]);

    useEffect(() => {
        if (hasFetched) return;
        if (loading) return;
        fetchData();
    }, [fetchData, hasFetched, loading]);
    return (
        <div className="space-y-3 min-h-[300px]">
            {createLoading && <TaskCardSkeleton />}

            {!hasFetched ? (
                <TaskLoadingList />
            ) : (
                <AnimatePresence mode="popLayout">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={() => onDelete(task.id as string)}
                            />
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
                                مفيش مهام حاليا
                            </h3>
                            <p className="text-sm text-foreground/50">
                                ابدأ بإضافة مهمة جديدة عشان تبدأ تنظم وقتك ☕
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
});

AllTaks.displayName = 'AllTaks';

export default AllTaks