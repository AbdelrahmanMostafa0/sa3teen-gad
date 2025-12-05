import UserProfileSettings from "@/components/settings/UserProfileSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ساعتين جد - إعدادات الحساب",
    metadataBase: new URL("https://sa3teen-gad.vercel.app"),
    description: "إدارة إعدادات حسابك الشخصي",
    openGraph: {
        title: "ساعتين جد - إعدادات الحساب",
        description: "إدارة إعدادات حسابك الشخصي",
        images: [
            {
                url: "https://sa3teen-gad.vercel.app/banners/readme-banner.png",
                width: 1200,
                height: 630,
                alt: "ساعتين جد - Pomodoro Timer & Prayer Times",
            },
        ],
        locale: "ar_EG",
        type: "website",
        url: "https://sa3teen-gad.vercel.app",
    },
    twitter: {
        card: "summary_large_image",
        title: "ساعتين جد - إعدادات الحساب",
        description: "إدارة إعدادات حسابك الشخصي",
        images: ["https://sa3teen-gad.vercel.app/banners/readme-banner.png"],
    },
};

export default function ProfileSettingsPage() {
    return <UserProfileSettings />;
}
