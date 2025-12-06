import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchUser, logout } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/services/profile";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.User
  );

  useEffect(() => {
    // Only fetch user if not already loaded and no error (to avoid infinite loops on 401)
    if (!user && !loading && !error && isAuthenticated === false) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, loading, error, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
      dispatch(fetchUser());
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    logout: handleLogout,
    refetchUser: () => dispatch(fetchUser()),
    updateProfile: handleUpdateProfile,
  };
};
