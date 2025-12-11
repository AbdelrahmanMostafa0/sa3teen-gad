import RenderSettings from "@/components/settings/RenderSettings";
// import SettingsPage from "@/components/settings/SettingsPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "ساعتين جد - الإعدادات",
  metadataBase: new URL("https://sa3teen-gad.vercel.app"),
  description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
  openGraph: {
    title: "ساعتين جد - الإعدادات",
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
    title: "ساعتين جد - الإعدادات",
    description: "ساعتين شاى وكوباية جد وكله هيبقا تمام",
    images: ["https://sa3teen-gad.vercel.app/banners/readme-banner.png"], // Full URL
  },
};
const page = () => {
  return <RenderSettings />;
};

export default page;