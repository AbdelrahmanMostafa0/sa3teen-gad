import Pomodoro from "@/components/pomodoro/Pomodoro";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen  bg-[#FEECD2]">
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
      <Pomodoro />
    </div>
  );
}
