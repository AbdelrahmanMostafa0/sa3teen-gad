import Pomodoro from "@/components/pomodoro/Pomodoro";
import PrayerTimes from "@/components/prayers/PrayerTimes";
import UserTasks from "@/components/tasks/UserTasks";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 space-y-10 font-bold bg-gradient-to-b from-background to-background/50">
      {/* Prayer Times Section - Top Strip */}
      <section className="w-full">
        <PrayerTimes />
      </section>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        {/* Pomodoro Timer - Central Focus */}
        <section className="w-full flex justify-center transform  transition-transform duration-300">
          <Pomodoro />
        </section>

        {/* Divider */}
        <div className="w-full max-w-[200px] h-1 bg-primary/10 rounded-full" />

        {/* Tasks Section */}
        <section className="w-full flex justify-center">
          <UserTasks />
        </section>
      </div>
      
      {/* Footer Spacing */}
      <div className="h-10" />
    </div>
  );
}
