"use client";

import { Moon, Sun, SunMoon, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-10 h-10 rounded-full"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const getCurrentIcon = () => {
    if (resolvedTheme === "black") return <SunMoon className="w-5 h-5" />;
    if (resolvedTheme === "dark") return <Moon className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full hover:bg-accent hover:text-accent-foreground"
        >
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer gap-2"
        >
          <Sun className="w-4 h-4" />
          <span className="flex-1">فاتح</span>
          {resolvedTheme === "light" && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer gap-2"
        >
          <Moon className="w-4 h-4" />
          <span className="flex-1">داكن</span>
          {resolvedTheme === "dark" && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("black")}
          className="cursor-pointer gap-2"
        >
          <SunMoon className="w-4 h-4" />
          <span className="flex-1">أسود نقي</span>
          {resolvedTheme === "black" && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}