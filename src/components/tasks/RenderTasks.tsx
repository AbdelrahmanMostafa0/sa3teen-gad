import { ITask } from '@/types/tasks'
import TaskCard from './TaskCard'
import NoTasks from './NoTasks'
import TaskCardSkeleton from './TaskCardSkeleton'
import useTasksActions from '@/hooks/useTasksActions'

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
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))
            ) : hasFetched && (
                <NoTasks />
            )}
        </div>
    )
}

export default RenderTasks