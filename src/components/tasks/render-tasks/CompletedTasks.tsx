import { ITask, PaginationData } from '@/types/tasks';
import { useCallback, useEffect, useState } from 'react'
import { getCompletedTasks } from '@/services/tasksApis';
import { AnimatePresence, motion } from 'motion/react';
import TaskCard from '../TaskCard';
import TaskLoadingList from './TaskLoadingList';
import { FiCheckCircle } from 'react-icons/fi';

interface CompletedTasksProps {
    createLoading?: boolean;
}

const CompletedTasks = ({ createLoading }: CompletedTasksProps) => {
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
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCompletedTasks({
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
                                مفيش مهام مكتملة
                            </h3>
                            <p className="text-sm text-foreground/50">
                                لسه مخلصتش حاجة؟ شد حيلك 😉
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export default CompletedTasks