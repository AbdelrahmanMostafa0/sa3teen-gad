"use client"
import useSyncLocalStorageToRedux from "@/hooks/useSyncLocalStorageToRedux";
import LoadingScreen from "@/components/LoadingScreen";
import { useEffect, useState } from "react";
import useUpdateSettings from "@/hooks/useUpdateSettings";

const SyncLocalstorageDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { getUserSettings, loading: settingLoading } = useUpdateSettings()

    // const { isLoading } = useSyncLocalStorageToRedux();
    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        if (!settingLoading) {
            getUserSettings()
        }
        return () => clearTimeout(timer);
    }, [])
    if (isLoading) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};

export default SyncLocalstorageDataProvider;
