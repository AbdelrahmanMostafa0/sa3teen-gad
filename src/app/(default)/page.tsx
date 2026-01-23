import Pomodoro from "@/components/pomodoro/Pomodoro";
import UserTasks from "@/components/tasks/UserTasks";
import { Metadata } from "next";
import { generateMetadata } from "@/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "ساعتين جد - مؤقت بومودورو وإدارة المهام",
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام. مؤقت بومودورو، إدارة المهام، وأوقات الصلاة في تطبيق واحد",
  path: "/",
});
export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 space-y-10 font-bold bg-gradient-to-b from-background to-background/50">
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        <section className="w-full flex justify-center transform  transition-transform duration-300">
          <Pomodoro />
        </section>

        <section className="w-full flex justify-center">
          <UserTasks />
        </section>
      </div>

      <div className="h-10" />
    </div>
  );
}
