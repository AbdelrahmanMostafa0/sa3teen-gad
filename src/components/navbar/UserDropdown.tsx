"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { LogOut, User, Settings, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export function UserDropdown() {
  const { user, logout } = useUser();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full hover:bg-accent transition-colors"
          >
            <Avatar className="h-10 w-10 ring-2 ring-background hover:ring-accent transition-all">
              <AvatarImage src={user.profilePicture} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2" align="start" sideOffset={8}>
          <DropdownMenuLabel dir="rtl" className="font-normal px-3 py-2">
            <div dir="ltr" className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                  {user.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.fullName}
                </p>
                <p dir="ltr" className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          {/* <DropdownMenuItem
            asChild
            dir="rtl"
            className="cursor-pointer rounded-md py-2.5 px-3"
          >
            <Link href="/profile" className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">الملف الشخصي</span>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            asChild
            dir="rtl"
            className="cursor-pointer rounded-md py-2.5 px-3"
          >
            <Link href="/settings" className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">الإعدادات</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            dir="rtl"
            className="cursor-pointer rounded-md py-2.5 px-3 text-red-500"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-accent transition-colors"
        >
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-white hover:bg-accent transition-colors">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 p-2" align="start" sideOffset={8}>
        <DropdownMenuItem
          dir="rtl"
          asChild
          className="cursor-pointer rounded-md py-2.5 px-3"
        >
          <Link href="/login" className="flex items-center gap-3">
            <LogIn className="h-4 w-4 text-muted-foreground ml-0 mr-0" />
            <span className="text-sm font-medium">تسجيل الدخول</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          dir="rtl"
          asChild
          className="cursor-pointer rounded-md py-2.5 px-3"
        >
          <Link href="/register" className="flex items-center gap-3">
            <UserPlus className="h-4 w-4 text-muted-foreground ml-0 mr-0" />
            <span className="text-sm font-medium">التسجيل</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}