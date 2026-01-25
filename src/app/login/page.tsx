"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useUser } from "@/hooks/useUser";
import { getAllTasks } from "@/store/features/allTasksSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import useUpdateSettings from "@/hooks/useUpdateSettings";

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { getUserSettings } = useUpdateSettings()

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});

    const result = await login(formData);

    if (result.success) {
      refetchUser();
      router.push("/");
      router.refresh();
      getUserSettings()
      dispatch(getAllTasks({ page: 1 }));

    } else {
      if (result.errors) {
        setFieldErrors(result.errors);
      } else {
        setError(result.message);
      }
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: [],
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/20">
      <Card className="w-full max-w-md shadow-2xl border-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription className="text-base">
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={` mt-2 ${fieldErrors.email ? "border-destructive" : ""}`}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={` mt-2 ${fieldErrors.password ? "border-destructive" : ""}`}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-4" variant={"default"} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">أو</span>
            </div>
          </div>

          <GoogleLoginButton onError={setError} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
