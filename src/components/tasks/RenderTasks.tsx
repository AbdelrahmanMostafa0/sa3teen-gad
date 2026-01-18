import { ITask } from '@/types/tasks'
import TaskCard from './TaskCard'
import NoTasks from './NoTasks'
import TaskCardSkeleton from './TaskCardSkeleton'
import useTasksActions from '@/hooks/useTasksActions'
import { AnimatePresence } from 'motion/react'

const RenderTasks = () => {
    const { tasks, loading, hasFetched, createPostLoading } = useTasksActions();

    return (
        <div className="space-y-3 ">
            {createPostLoading && (
                <>
                    <TaskCardSkeleton />
                </>
            )}
            {!hasFetched && loading ? <>
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
            </> : tasks.length > 0 ? (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {tasks.map((task) => (
                            <TaskCard key={task.id || (task as any)._id} task={task} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : hasFetched && (
                <NoTasks />
            )}
        </div>
    )
}

export default RenderTasks