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
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '@/lib/auth-middleware';

export default function UserProfileSettings() {
    const router = useRouter();
    const { user, loading: fetchLoading, error: fetchError, refetchUser } = useUser();
    const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const settings = useSelector((state: RootState) => state.Settings);
    const handleUpdate = async (data: any) => {
        try {
            await updateUser(data);
            setSuccessMessage('تم حفظ التغييرات بنجاح');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };



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
                    {user && (
                        <ProfileSection
                            user={user}
                            onUpdate={handleUpdate}
                            loading={updateLoading}
                        />
                    )}
                    <TimerSettingsSection
                        timers={settings.timers}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <WaterReminderSection
                        waterReminder={settings.waterReminder}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <PrayerReminderSection
                        prayerReminder={settings.prayerReminder}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <LocationSection
                        location={settings.location}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />

                    <UIPreferencesSection
                        ui={settings.ui}
                        onUpdate={handleUpdate}
                        loading={updateLoading}
                    />
                </div>
            </div>
        </div>
    );
}
