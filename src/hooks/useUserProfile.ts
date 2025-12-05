import { useState, useEffect, useCallback } from "react";
import { IUser } from "@/types/user";

interface UseUserProfileReturn {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "فشل تحميل البيانات");
      }

      setUser(data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ ما";
      setError(errorMessage);
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
