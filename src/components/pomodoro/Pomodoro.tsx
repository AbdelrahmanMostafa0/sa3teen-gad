"use client";
import FocusTimer from "./FocusTimer";
import BreakTime from "./BreakTime";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayedTimer } from "@/store/features/settingsSlice";
import { RootState } from "@/store/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Pomodoro = () => {
  const dispatch = useDispatch();
  const { displayedTimer } = useSelector((state: RootState) => state.Settings);

  const handleTabChange = (value: string) => {
    dispatch(updateDisplayedTimer(value as "focus" | "shortBreak"));
  };

  return (
    <div className="w-full flex justify-center items-center flex-col gap-6 md:w-full md:max-w-[400px] mx-auto px-8">
      <Tabs
        value={displayedTimer}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 rounded-full">
          <TabsTrigger value="shortBreak" className="text-sm font-semibold rounded-full">
            بريك ☕
          </TabsTrigger>
          <TabsTrigger value="focus" className="text-sm font-semibold rounded-full">
            تركيز 🎯
          </TabsTrigger>
        </TabsList>

        <TabsContent value="focus" className="mt-6">
          <FocusTimer />
        </TabsContent>

        <TabsContent value="shortBreak" className="mt-6">
          <BreakTime />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pomodoro;
