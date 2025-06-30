import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import Navbar from "@/components/navbar/Navbar";
import DrinkWater from "@/components/reminders/DrinkWater";
import { TimeProvider } from "@/context/TimeContext";
// import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ساعتين جد",
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <ReduxProvider>
        <body dir="rtl" className="bg-[#FEECD2]">
          <TimeProvider>
            <Navbar />
            <DrinkWater />
            {children}
            {/* <Footer /> */}
          </TimeProvider>
        </body>
      </ReduxProvider>
    </html>
  );
}
