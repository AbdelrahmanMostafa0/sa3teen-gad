import { ITask } from '@/types/tasks'
import NoTasks from './NoTasks'
import TaskCardSkeleton from './TaskCardSkeleton'
import SortableTaskCard from './SortableTaskCard'
import useTasksActions from '@/hooks/useTasksActions'
import useSortableTasks from '@/hooks/useSortableTasks'
import { AnimatePresence } from 'motion/react'
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface RenderTasksProps {
    isDraggable?: boolean;
}

const RenderTasks = ({ isDraggable = false }: RenderTasksProps) => {
    const { tasks, loading, hasFetched, createPostLoading } = useTasksActions();
    const {
        sortedTasks,
        sensors,
        handleDragEnd,
    } = useSortableTasks({ tasks, enabled: isDraggable });

    return (
        <div className="space-y-3">
            {createPostLoading && <TaskCardSkeleton />}

            {!hasFetched && loading ? (
                <>
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                </>
            ) : tasks.length > 0 ? (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedTasks.map(t => t.id || (t as any)._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sortedTasks.map((task) => (
                                    <SortableTaskCard
                                        key={task.id || (task as any)._id}
                                        task={task}
                                        isDraggable={isDraggable}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </AnimatePresence>
                </div>
            ) : hasFetched && (
                <NoTasks />
            )}
        </div>
    )
}

export default RenderTasks