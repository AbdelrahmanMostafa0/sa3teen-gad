import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchUser, logout } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/services/profile";
import Cookies from "js-cookie";
import { updateSettings } from "@/store/features/settingsSlice";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, isAuthenticated, hasFetched } = useSelector(
    (state: RootState) => state.User
  );
  const token = Cookies.get("token");

  useEffect(() => {
    if (!hasFetched && !loading && token) {
      dispatch(fetchUser());
    }
  }, [hasFetched, loading, dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Load settings from user data only once when user is first fetched
  // useEffect(() => {
  //   if (user?.settings && hasFetched && !loading) {
  //     dispatch(updateSettings(user.settings));
  //   }
  // }, [hasFetched]); // Only run when hasFetched changes (once)

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
