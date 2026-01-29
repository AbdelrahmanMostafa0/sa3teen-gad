import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { setActiveTab } from '@/store/features/timerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { terminatePomodoroSession } from '@/services/pomodoro.service';
import { resetPomodoroSession } from '@/store/features/pomodoroSlice';

const ChangePomoDialog = ({ changeTo, open, setIsOpen }: { changeTo: string, open: boolean, setIsOpen: (value: boolean) => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useSelector((state: RootState) => state.Pomodoro);
    const handleConfirm = async () => {
        dispatch(setActiveTab(changeTo as "focus" | "shortBreak" | "longBreak"));
        await terminatePomodoroSession(id as string)
        dispatch(resetPomodoroSession())
    };

    return (
        <Dialog open={open} onOpenChange={setIsOpen} >
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader dir='rtl' className="text-right">

                </DialogHeader>
                <DialogTitle>تغيير نظام المؤقت</DialogTitle>
                <DialogDescription>
                    هل أنت متأكد من تغيير النظام إلى {
                        changeTo === 'focus' ? 'التركيز' :
                            changeTo === 'shortBreak' ? 'استراحة قصيرة' :
                                'استراحة طويلة'
                    }؟ سيتم حفظ الوقت الذي قضيته حتى الآن كجلسة، ولكن لن يتم احتسابها كجلسة مكتملة.
                </DialogDescription>
                <DialogFooter className="flex flex-row-reverse gap-2 sm:justify-start">

                    <DialogClose asChild>
                        <Button type="button" onClick={handleConfirm}>تأكيد التغيير</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">إلغاء</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePomoDialog
