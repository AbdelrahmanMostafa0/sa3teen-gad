"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
// import { getIncompleteTasks } from "@/services/tasksApis";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getAllTasks } from "@/store/features/allTasksSlice";
import useUpdateSettings from "@/hooks/useUpdateSettings";
import { loginWithGoogle } from "@/lib/auth";

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useUser()
  const { getUserSettings } = useUpdateSettings()
  const dispatch = useDispatch<AppDispatch>();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await loginWithGoogle(tokenResponse.access_token);

        if (res.success) {
          router.push("/");
          router.refresh();
          refetchUser()
          getUserSettings()
          dispatch(getAllTasks({ page: 1 }));
        }
      } catch (error) {
        console.error("Google login error:", error);
        if (onError) {
          onError("حدث خطأ أثناء تسجيل الدخول بجوجل");
        }
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setLoading(false);
      if (onError) {
        onError("فشل تسجيل الدخول بجوجل");
      }
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      // className=
      className="w-full bg-white dark:bg-white cursor-pointer hover:bg-white dark:hover:bg-white hover:text-black  dark:text-black drop-shadow-md"
      onClick={() => login()}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          جاري تسجيل الدخول...
        </>
      ) : (
        <>
          <FcGoogle className="ml-2 h-5 w-5" />
          تسجيل الدخول بجوجل
        </>
      )}
    </Button>
  );
}
