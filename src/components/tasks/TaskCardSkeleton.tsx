"use client";

import { motion } from "motion/react";

const TaskCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-foreground/10 rounded-xl p-4 transition-all duration-300 pointer-events-none"
        >
            <div className="relative flex items-center justify-between gap-4">
                {/* Title Placeholder */}
                <div className="flex-1 w-full text-start">
                    <div className="h-6 w-3/4 rounded bg-foreground/10 animate-pulse" />
                </div>

                {/* Checkbox Placeholder */}
                <div className="shrink-0 h-8 w-8 rounded-lg border-2 border-slate-300 dark:border-foreground/20 flex items-center justify-center bg-slate-100 dark:bg-foreground/5 animate-pulse" />
            </div>
        </motion.div>
    );
};

export default TaskCardSkeleton;
