import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

const TasksHeader = () => {
    return (
        <div className=" rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-sm">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-lg bg-foreground/10">
                        <FiCheckCircle className="text-foreground text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                        الكلام على إيه؟
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default TasksHeader