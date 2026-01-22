"use client";

import { motion } from "motion/react";

const TaskCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-foreground/10 border animate-pulse   border-foreground/10 rounded-xl p-4 transition-all duration-300 pointer-events-none"
        >
            <div className="h-6 w-full" />
            {/* <div className="h-6 w-3/4 animate-pulse rounded bg-foreground/10" /> */}

        </motion.div>
    );
};

export default TaskCardSkeleton;
