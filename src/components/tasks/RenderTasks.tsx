import { ITask } from '@/types/tasks'
import TaskCard from './TaskCard'
import NoTasks from './NoTasks'

const RenderTasks = ({ tasks }: { tasks: ITask[] }) => {
    return (
        <div className="space-y-3 ">
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