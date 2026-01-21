"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import ProfileSection from "./profile/ProfileSection";
import TimerSettingsSection from "./profile/TimerSettingsSection";
import WaterReminderSection from "./profile/WaterReminderSection";
import PrayerReminderSection from "./profile/PrayerReminderSection";
import LocationSection from "./profile/LocationSection";
import UIPreferencesSection from "./profile/UIPreferencesSection";
import TaskSettingsSection from "./profile/TaskSettingsSection";
import { useUser } from "@/hooks/useUser";
import useUpdateSettings from "@/hooks/useUpdateSettings";

export default function UserProfileSettings() {
  const { user } = useUser();

  const {
    getUserSettings,
    updateSettings,
    loading: updateSettingsLoading,
    error: updateSettingsError,
  } = useUpdateSettings();
  // useEffect(() => {
  //   getUserSettings();
  // }, []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleUpdate = async (data: any) => {
    try {
      await updateSettings(data);
      setSuccessMessage("تم حفظ التغييرات بنجاح");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      await getUserSettings();
      console.error("Update failed:", error);
      setError("حدث خطأ أثناء حفظ التغييرات");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-background/50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">
            الأهم من الشغل تظبيط الشغل
          </h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <XCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive font-medium">{error || "حدث خطأ أثناء حفظ التغييرات"}</p>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {user && <ProfileSection />}
          <TimerSettingsSection
            // timers={settings.timers}
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          />
          {/* <TaskSettingsSection
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          /> */}
          <WaterReminderSection
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          />

          <PrayerReminderSection
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          />

          <LocationSection
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          />

          <UIPreferencesSection
            onUpdate={handleUpdate}
            loading={updateSettingsLoading}
          />
        </div>
      </div>
    </div>
  );
}
