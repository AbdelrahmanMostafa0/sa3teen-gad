import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ITask } from "@/types/tasks";
import TaskCard from "./TaskCard";

interface SortableTaskCardProps {
    task: ITask;
    isDraggable?: boolean;
}

/**
 * Wrapper component that makes a TaskCard sortable via drag and drop
 */
const SortableTaskCard = ({ task, isDraggable = true }: SortableTaskCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id || (task as any)._id,
        disabled: !isDraggable,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <TaskCard
                task={task}
                dragHandle={isDraggable ? { attributes, listeners } : undefined}
            />
        </div>
    );
};

export default SortableTaskCard;
