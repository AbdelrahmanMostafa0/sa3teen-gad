import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import Navbar from "@/components/navbar/Navbar";
import DrinkWater from "@/components/reminders/DrinkWater";
import { TimeProvider } from "@/context/TimeContext";
import { ThemeProvider } from "@/components/theme-provider";
import PrayerReminder from "@/components/reminders/PrayerReminder";
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
    <html lang="ar" suppressHydrationWarning>
      <ReduxProvider>
        <body dir="rtl" className="bg-background text-foreground transition-colors duration-300">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TimeProvider>
              <Navbar />
              <PrayerReminder />
              <DrinkWater />
              {children}
              {/* <Footer /> */}
            </TimeProvider>
          </ThemeProvider>
        </body>
      </ReduxProvider>
    </html>
  );
}
