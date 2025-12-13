"use client";
import FocusTimer from "./FocusTimer";
import BreakTime from "./BreakTime";
import { useDispatch, useSelector } from "react-redux";
// import { updateDisplayedTimer } from "@/store/features/settingsSlice";
// import { RootState } from "@/store/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RiZzzLine } from "react-icons/ri";
import { Coffee, Target } from "lucide-react";
import { useState } from "react";
const Pomodoro = () => {
  const dispatch = useDispatch();
  const [displayedTimer, setDisplayedTimer] = useState("focus");
  console.log(displayedTimer);
  const handleTabChange = (value: string) => {
    setDisplayedTimer(value);
    // dispatch(updateDisplayedTimer(value as "focus" | "shortBreak"));
  };

  return (
    <div className="w-full flex justify-center items-center flex-col gap-6 md:w-full md:max-w-[500px] mx-auto px-4">
      <Tabs
        variant={"primary"}
        value={displayedTimer}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3 rounded-full">
          <TabsTrigger value="longBreak" className="text-sm font-semibold rounded-full flex items-center gap-2">
            <span className="md:block hidden">بريك طويل</span>
            <RiZzzLine size={18} />
          </TabsTrigger>
          <TabsTrigger value="shortBreak" className="text-sm font-semibold rounded-full flex items-center gap-2">
            <span className="md:block hidden">بريك قصير</span>
            <Coffee size={18} />
          </TabsTrigger>
          <TabsTrigger value="focus" className="text-sm font-semibold rounded-full flex items-center gap-2">
            <span className="md:block hidden">تركيز</span>
            <Target size={18} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="focus" className="mt-6 md:max-w-[400px] mx-auto">
          <FocusTimer key="focus" />
        </TabsContent>
        <TabsContent value="longBreak" className="mt-6 md:max-w-[400px] mx-auto">
          <BreakTime key="longBreak" breakType="longBreak" />

        </TabsContent>

        <TabsContent value="shortBreak" className="mt-6 md:max-w-[400px] mx-auto">
          <BreakTime key="shortBreak" breakType="shortBreak" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pomodoro;
