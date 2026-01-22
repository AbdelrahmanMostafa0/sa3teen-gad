import { ITask, PaginationData } from '@/types/tasks';
import { useCallback, useEffect, useState } from 'react'
import { getAllTasks, getCompletedTasks, getIncompleteTasks } from '@/services/tasksApis';
import { AnimatePresence, motion } from 'motion/react';
import TaskCard from '../TaskCard';
import TaskLoadingList from './TaskLoadingList';
import { FiCheckCircle } from 'react-icons/fi';

const IncompletedTasks = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getIncompleteTasks({
                page: pagination.page,
                limit: pagination.limit,
            });
            setTasks(response.tasks);
            setPagination(response.pagination);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [pagination.page, pagination.limit]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return (
        <div className="space-y-3 min-h-[300px]">
            {loading ? (
                <TaskLoadingList />
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
                                مفيش مهام نشطة
                            </h3>
                            <p className="text-sm text-foreground/50">
                                عاش يا بطل! خلصت كل اللي وراك 💪
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export default IncompletedTasks