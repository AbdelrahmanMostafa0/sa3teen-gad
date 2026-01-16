import { useState } from "react";
import axios from "axios";

interface UpdateUserData {
  fullName?: string;
  profilePicture?: string | null;
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
      const response = await axios.put("/api/auth/me", data);
      const result = await response.data;

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
