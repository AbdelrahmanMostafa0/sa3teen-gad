"use client";


import PrayerTimes from "@/components/prayers/PrayerTimes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import WelcomeModalProvider from "@/components/providers/WelcomeModalProvider";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const prayerTimesPosition = useSelector(
        (state: RootState) => state.Settings.ui.prayerTimesPosition
    );
    // const { user } = useUser();

    return (

        <>
            {/* Welcome Modal for Unauthenticated Users */}
            <WelcomeModalProvider />

            {/* Desktop Layout with Positioning */}
            <div className="hidden md:block">
                {prayerTimesPosition === "top" && (
                    <div className="w-full pt-4">
                        <PrayerTimes variant="horizontal" />
                    </div>
                )}

                <div className="flex">
                    {prayerTimesPosition === "right" && (
                        <aside className="w-64 min-h-screen border-l border-border/40 p-4 sticky top-0">
                            <PrayerTimes variant="vertical" />
                        </aside>
                    )}

                    <main className="flex-1">{children}</main>

                    {prayerTimesPosition === "left" && (
                        <aside className="w-64 min-h-screen border-r border-border/40 p-4 sticky top-0">
                            <PrayerTimes variant="vertical" />
                        </aside>
                    )}
                </div>

            </div>

            {/* Mobile Layout - Always Top */}
            <div className="md:hidden">
                <div className="w-full pt-4">
                    <PrayerTimes variant="horizontal" />
                </div>
                {children}
            </div>

        </>

    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LayoutContent>{children}</LayoutContent>
    );
}
