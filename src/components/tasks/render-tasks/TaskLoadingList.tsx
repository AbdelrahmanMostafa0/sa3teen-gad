import React from 'react'
import TaskCardSkeleton from '../TaskCardSkeleton'

const TaskLoadingList = () => {
    return (
        <div className="space-y-4">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
        </div>
    )
}

export default TaskLoadingList