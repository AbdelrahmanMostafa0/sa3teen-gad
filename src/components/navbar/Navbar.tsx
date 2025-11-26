"use client";
import { format } from "date-fns";
import { useTime } from "@/context/TimeContext";
import { ModeToggle } from "../mode-toggle";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  const time = useTime();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Left Side: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Time Display */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-secondary/50 rounded-full border border-border/50 shadow-sm">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-mono font-bold text-primary pt-1">
              {format(time, "hh:mm:ss a").replace("AM", "ص").replace("PM", "م")}
            </p>
          </div>

          {/* Mobile Time (Simplified) */}
          <div className="md:hidden flex items-center gap-1 text-sm font-bold text-primary">
             {format(time, "hh:mm a").replace("AM", "ص").replace("PM", "م")}
          </div>

          <div className="h-6 w-[1px] bg-border/60 mx-1" />

          <ModeToggle />
          <Link href="/settings" className="text-2xl hover:text-primary transition-colors">
            <IoMdSettings />
          </Link>
        </div>

        {/* Right Side: Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={45}
            height={45}
            alt="ساعتين جد logo"
            className="drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
