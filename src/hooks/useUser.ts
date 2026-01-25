import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchUser, logout, setStatus } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/services/profile";
import Cookies from "js-cookie";
import { updateSettings } from "@/store/features/settingsSlice";
import { IUser } from "@/types/user";
import { resetAllTasks } from "@/store/features/allTasksSlice";
import useUpdateSettings from "./useUpdateSettings";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { getUserSettings } = useUpdateSettings();

  const {
    user,
    loading,
    error,
    isAuthenticated,
    hasFetched,
    status,
    userType,
  } = useSelector((state: RootState) => state.User);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!hasFetched && !loading && token) {
      dispatch(fetchUser());
    } else {
      dispatch(setStatus("failed"));
    }
  }, [hasFetched, loading, dispatch, token]);
  useEffect(() => {
    if (userType === "guest") {
      Cookies.get("guestId");
    }
  }, [userType]);
  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    Cookies.remove("guestId");
    dispatch(resetAllTasks());
    getUserSettings();
    router.push("/login");
  };

  // Load settings from user data only once when user is first fetched
  // useEffect(() => {
  //   if (user?.settings && hasFetched && !loading) {
  //     dispatch(updateSettings(user.settings));
  //   }
  // }, [hasFetched]); // Only run when hasFetched changes (once)

  const handleUpdateProfile = async (data: IUser) => {
    try {
      await updateProfile(data);
      dispatch(fetchUser());
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const refetchUser = async () => {
    const result = await dispatch(fetchUser());
    // Use the fetched user data from the action result, not the stale state
    if (result.payload && "settings" in result.payload) {
      await dispatch(updateSettings(result.payload.settings));
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    status,
    logout: handleLogout,
    refetchUser,
    updateProfile: handleUpdateProfile,
  };
};
