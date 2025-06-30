import Pomodoro from "@/components/pomodoro/Pomodoro";
import PrayerTimes from "@/components/prayers/PrayerTimes";
import UserTasks from "@/components/tasks/UserTasks";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-10   space-y-8 font-bold">
      {/* <div className="space-y-6">
        <Image
          src={"/character.png"}
          width={500}
          height={500}
          alt="ساعتين جد"
          className="max-w-[85vw] sm:max-w-[400px] "
        />
        <h1 className="text-5xl  text-center">ساعتين جد</h1>
      </div> */}
      <PrayerTimes />
      <Pomodoro />
      <hr className="max-w-[95%] md:max-w-[700px] w-full  " />
      <UserTasks />
    </div>
  );
}
