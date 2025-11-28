"use client"
import useSyncLocalStorageToRedux from "@/hooks/useSyncLocalStorageToRedux";
import LoadingScreen from "@/components/LoadingScreen";

const SyncLocalstorageDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoading } = useSyncLocalStorageToRedux();
    
    if (isLoading) {
        return <LoadingScreen />;
    }
    
    return <>{children}</>;
};

export default SyncLocalstorageDataProvider;
