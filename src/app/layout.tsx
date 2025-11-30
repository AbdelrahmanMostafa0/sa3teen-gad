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
import Head from "next/head";

// export const metadata: Metadata = {
//   title: "ساعتين جد",
//   metadataBase: new URL("https://sa3teen-gad.vercel.app"),
//   description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
//   openGraph: {
//     title: "ساعتين جد",
//     description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
//     images: [
//       {
//         url: "/banners/readme-banner.png",
//         width: 1200,
//         height: 630,
//         alt: "ساعتين جد - Pomodoro Timer & Prayer Times",
//       },
//     ],
//     locale: "ar_EG",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ساعتين جد",
//     description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
//     images: ["/banners/readme-banner.png"],
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="ar" suppressHydrationWarning>
      
    <Head>

      <meta property="og:title" content="ساعتين جد" />
      <meta property="og:description" content="ساعتين شاى وكوباية جد وكله هيبقا تمام" />
      <meta property="og:image" content="/banners/readme-banner.png" />
      {/* <meta property="og:url" content="https://sa3teen-gad.vercel.app" /> */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ar_EG" />
    </Head>
      <ReduxProvider>
        <body dir="rtl" className="bg-background text-foreground transition-colors duration-300 md:pb-0 pb-16">
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
        </body>
      </ReduxProvider>
    </html>
  );
}
