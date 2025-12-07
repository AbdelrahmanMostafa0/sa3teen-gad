"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import { shouldShowAnalyticsPrompt } from "@/utils/analytics-prompt";
import AnalyticsPromptModal from "@/components/modals/AnalyticsPromptModal";

export default function WelcomeModalProvider() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Small delay to ensure smooth page load
        const timer = setTimeout(() => {
            // Only show modal if user is not authenticated and hasn't dismissed recently
            if (!isAuthenticated() && shouldShowAnalyticsPrompt()) {
                setShowModal(true);
            }
        }, 1500); // 1.5 second delay for better UX

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnalyticsPromptModal
            open={showModal}
            onOpenChange={setShowModal}
        />
    );
}
