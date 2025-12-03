import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import Navbar from "@/components/navbar/Navbar";
import DrinkWater from "@/components/reminders/DrinkWater";
import { TimeProvider } from "@/context/TimeContext";
import { ThemeProvider } from "@/components/theme-provider";
import PrayerReminder from "@/components/reminders/PrayerReminder";
import SyncLocalstorageDataProvider from "@/providers/SyncLocalstorageDataProvider";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        dir="rtl"
        className="bg-background text-foreground transition-colors duration-300 md:pb-0 pb-16"
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SyncLocalstorageDataProvider>
                <TimeProvider>
                  <Navbar />
                  <PrayerReminder />
                  <DrinkWater />
                  {children}
                  <Footer />
                </TimeProvider>
              </SyncLocalstorageDataProvider>
            </ThemeProvider>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
