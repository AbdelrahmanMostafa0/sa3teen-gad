"use client";
import { format } from "date-fns";
import { useTime } from "@/context/TimeContext";
import { ModeToggle } from "../mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi";
import { Home } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { UserDropdown } from "./UserDropdown";
import { Button } from "../ui/button";

const Navbar = () => {
  const time = useTime();
  const { user } = useUser();
  console.log(user);

  return (
    <>
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          {/* LEFT — Desktop */}
          <div className="hidden md:flex items-center gap-3 md:gap-6">
            {/* Desktop Clock */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-secondary/50 rounded-full border border-border/50 shadow-sm">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-sm font-mono font-bold text-primary pt-1">
                {format(time, "hh:mm:ss a")
                  .replace("AM", "ص")
                  .replace("PM", "م")}
              </p>
            </div>

            <div className="h-6 w-[1px] bg-border/60 mx-1" />

            <ModeToggle />
            <Link
              href="/tasks"
              className="text-2xl hover:text-primary transition-colors"
            >
              <FiCheckSquare />
            </Link>
            <Link
              href="/settings"
              className="text-2xl hover:text-primary transition-colors"
            >
              <IoMdSettings />
            </Link>

            <div className="h-6 w-[1px] bg-border/60 mx-1" />

            {user ? (
              <UserDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">إنشاء حساب</Link>
                </Button>
              </div>
            )}
          </div>

          {/* LEFT — Mobile (clock + toggle) */}
          <div className="md:hidden flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">
              {format(time, "hh:mm a").replace("AM", "ص").replace("PM", "م")}
            </span>

            <div className="h-5 w-[1px] bg-border/60" />

            <ModeToggle />
          </div>

          {/* RIGHT — Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={45}
              height={45}
              alt="ساعتين جد logo"
              className="drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </header>

      {/* MOBILE BOTTOM BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur flex justify-around py-3">
        <Link
          href="/tasks"
          className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors"
        >
          <FiCheckSquare className="w-6 h-6" />
          <span className="text-xs mt-1">المهام</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">الرئيسية</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center text-primary hover:text-primary/80 transition-colors"
        >
          <IoMdSettings className="w-6 h-6" />
          <span className="text-xs mt-1">الإعدادات</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
