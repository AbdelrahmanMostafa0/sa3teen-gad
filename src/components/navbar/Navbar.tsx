"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { useTime } from "@/context/TimeContext";
import { ModeToggle } from "../mode-toggle";
import Image from "next/image";
import Link from "next/link";
// import { Clock } from "lucide-react";

import { FiCheckSquare } from "react-icons/fi";
import { Home, Settings2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { UserDropdown } from "./UserDropdown";
import { BiTask } from "react-icons/bi";
import { useEffect } from "react";
// import { Button } from "../ui/button";

const Navbar = () => {
  const pathname = usePathname();
  // const time = useTime();
  const { user } = useUser();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          <div className=" flex items-center gap-3 md:gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                width={45}
                height={45}
                alt="ساعتين جد logo"
                className="drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
              {/* <h1 className="text-2xl font-bold">ساعتين جد</h1> */}
            </Link>

          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm flex items-center gap-2 font-medium transition-colors",
                pathname === "/"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
            <Link
              href="/tasks"
              className={cn(
                "text-sm flex items-center gap-2 font-medium transition-colors",
                pathname === "/tasks"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <BiTask className="w-4 h-4" />
              المهام
            </Link>
            <Link
              href="/settings"
              className={cn(
                "text-sm flex items-center gap-2 font-medium transition-colors",
                pathname === "/settings"
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Settings2 className="w-4 h-4" />
              الإعدادات
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserDropdown />
          </div>
        </div>
      </header>

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
          <Settings2 className="w-6 h-6" />
          <span className="text-xs mt-1">الإعدادات</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
