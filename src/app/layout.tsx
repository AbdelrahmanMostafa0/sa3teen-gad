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
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ساعتين جد" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
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
              themes={["light", "dark", "black"]}
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
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
