import { ITask } from '@/types/tasks'
import TaskCard from './TaskCard'
import NoTasks from './NoTasks'
import TaskCardSkeleton from './TaskCardSkeleton'

const RenderTasks = ({ tasks, loading }: { tasks: ITask[], loading: boolean }) => {
    return (
        <div className="space-y-3 ">
            {loading && (
                <>
                    <TaskCardSkeleton />
                </>
            )}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))
            ) : (
                <NoTasks />
            )}
        </div>
    )
}

export default RenderTasks