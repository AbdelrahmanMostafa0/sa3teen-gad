"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import ProfileSection from './profile/ProfileSection';
import TimerSettingsSection from './profile/TimerSettingsSection';
import WaterReminderSection from './profile/WaterReminderSection';
import PrayerReminderSection from './profile/PrayerReminderSection';
import LocationSection from './profile/LocationSection';
import UIPreferencesSection from './profile/UIPreferencesSection';
import { useUser } from '@/hooks/useUser';

export default function UserProfileSettings() {
    const router = useRouter();
    const { user, loading: fetchLoading, error: fetchError, refetchUser } = useUser();
    const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleUpdate = async (data: any) => {
        try {
            await updateUser(data);
            await refetchUser(); // Refresh user data after update
            setSuccessMessage('تم حفظ التغييرات بنجاح');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-lg text-muted-foreground">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (fetchError || !user) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <XCircle className="w-16 h-16 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold">حدث خطأ</h2>
                    <p className="text-muted-foreground">{fetchError || 'فشل تحميل البيانات'}</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => refetchUser()}>إعادة المحاولة</Button>
                        <Button variant="outline" onClick={() => router.push('/')}>
                            العودة للرئيسية
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary">إعدادات الحساب</h1>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        رجوع
                    </Button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-500 font-medium">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {updateError && (
                    <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <p className="text-destructive font-medium">{updateError}</p>
                    </div>
                )}

                {/* Settings Sections */}
                <div className="space-y-6">
                    <ProfileSection
                        user={user}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <TimerSettingsSection
                        timers={user.settings.timers}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <WaterReminderSection
                        waterReminder={user.settings.waterReminder}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <PrayerReminderSection
                        prayerReminder={user.settings.prayerReminder}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <LocationSection
                        location={user.settings.location}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <UIPreferencesSection
                        ui={user.settings.ui}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />
                </div>
            </div>
        </div>
    );
}
