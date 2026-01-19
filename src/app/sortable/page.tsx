"use client"
import React, { useEffect, useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMenu } from 'react-icons/fi';
import { sort } from '@/utils/linkedlist';

type Task = {
    id: string;
    title: string;
    prevTaskId?: string | null;
    nextTaskId?: string | null;
}

const SortableItem = ({ task }: { task: Task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center gap-4 bg-card border border-foreground/10 rounded-xl p-4 mb-3 transition-shadow hover:shadow-md ${isDragging ? 'opacity-50' : ''}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-foreground/5 rounded"
            >
                <FiMenu className="text-foreground/40" />
            </div>
            <span className="font-semibold text-foreground">{task.title}</span>
        </div>
    );
};

const Page = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1sadsadcasdaspojdpsjpd', title: 'Task 1', nextTaskId: '2sadsadcasdaspojdpsjpd' },
        { id: '3sadsadcasdaspojdpsjpd', title: 'Task 3', prevTaskId: '2sadsadcasdaspojdpsjpd' },
        { id: '2sadsadcasdaspojdpsjpd', title: 'Task 2', prevTaskId: '1sadsadcasdaspojdpsjpd', nextTaskId: '3sadsadcasdaspojdpsjpd' },
    ])
    const sortedTasks = sort(tasks)
    console.log(sortedTasks)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // useEffect(() => {
    //     const savedTasks = localStorage.getItem('tasks')
    //     if (savedTasks) {
    //         try {
    //             setTasks(JSON.parse(savedTasks))
    //         } catch (e) {
    //             console.error("Failed to parse tasks from localStorage", e)
    //         }
    //     }
    // }, [])

    // useEffect(() => {
    //     localStorage.setItem('tasks', JSON.stringify(tasks))
    // }, [tasks])

    const handleDragEnd = (event: DragEndEvent) => {

        console.log(event)
        const { active, over } = event;

        // if (over && active.id !== over.id) {
        //     setTasks((items) => {
        //         const oldIndex = items.findIndex(item => item.id === active.id);
        //         const newIndex = items.findIndex(item => item.id === over.id);
        //         return arrayMove(items, oldIndex, newIndex);
        //     });
        // }
        if (over && over.id) {
            const curruntTask = tasks.find(item => item.id === active.id);
            const overTask = tasks.find(item => item.id === over.id);
            // setTasks(arrayMove(tasks, oldIndex, newIndex));
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">ترتيب المهام</h1>
                <p className="text-muted-foreground">اسحب ورتب المهام بتاعتك براحتك</p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col">
                        {tasks.map((task) => (
                            <SortableItem key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default Page

