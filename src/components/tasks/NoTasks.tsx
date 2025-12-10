import { FiCheckCircle } from 'react-icons/fi'

const NoTasks = () => {
    return (
        <div className="text-center py-16 px-4 border-2 border-dashed border-foreground/10">
            <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-foreground/5">
                    <FiCheckCircle className="text-5xl text-foreground/30" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
                مفيش مهام حاليا
            </h3>
            <p className="text-sm text-foreground/50">
                ابدأ بإضافة مهمة جديدة عشان تبدأ تنظم وقتك ☕
            </p>
        </div>
    )
}

export default NoTasks