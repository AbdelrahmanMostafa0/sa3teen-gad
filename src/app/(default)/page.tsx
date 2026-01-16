import Pomodoro from "@/components/pomodoro/Pomodoro";
import UserTasks from "@/components/tasks/UserTasks";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ساعتين جد",
  metadataBase: new URL("https://sa3teen-gad.vercel.app"),
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
  openGraph: {
    title: "ساعتين جد",
    description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
    images: [
      {
        url: "https://sa3teen-gad.vercel.app/banners/readme-banner.png", // Full URL
        width: 1200,
        height: 630,
        alt: "ساعتين جد - Pomodoro Timer & Prayer Times",
      },
    ],
    locale: "ar_EG",
    type: "website",
    url: "https://sa3teen-gad.vercel.app", // Add this
  },
  twitter: {
    card: "summary_large_image",
    title: "ساعتين جد",
    description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
    images: ["https://sa3teen-gad.vercel.app/banners/readme-banner.png"], // Full URL
  },
};
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
