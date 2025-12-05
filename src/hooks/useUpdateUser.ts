import { useState } from "react";
import { SettingsType } from "@/types/user";

interface UpdateUserData {
  fullName?: string;
  profilePicture?: string | null;
  settings?: Partial<{
    timers?: Partial<SettingsType["timers"]>;
    waterReminder?: Partial<SettingsType["waterReminder"]>;
    prayerReminder?: Partial<SettingsType["prayerReminder"]>;
    location?: Partial<SettingsType["location"]>;
    ui?: Partial<SettingsType["ui"]>;
  }>;
}

interface UseUpdateUserReturn {
  updateUser: (data: UpdateUserData) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (data: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "فشل التحديث");
      }

      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ ما";
      setError(errorMessage);
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}
