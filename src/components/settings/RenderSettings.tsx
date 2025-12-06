"use client"

import { useUser } from "@/hooks/useUser";
import SettingsPage from "./SettingsPage";
import UserProfileSettings from "./UserProfileSettings";

const RenderSettings = () => {
    const { user, loading } = useUser();
    if (loading) {
        return <div>loading...</div>;
    }
    if (!user) {
        return <SettingsPage />
    }
    return <UserProfileSettings />;
};

export default RenderSettings;