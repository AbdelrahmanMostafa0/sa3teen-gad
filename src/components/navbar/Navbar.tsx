"use client";
import { format } from "date-fns";
import { useTime } from "@/context/TimeContext";
import Settings from "./Settings";
import Image from "next/image";
import { useEffect } from "react";
import { getPrayers } from "@/services/prayerApi";

const Navbar = () => {
  const time = useTime();
  useEffect(() => {
    const formattedDate = format(new Date(), "yyyy-M-d");
    getPrayers({ city: "cairo", country: "EGY", date: formattedDate });
  }, []);
  return (
    <div className=" py-4 flex items-center gap-4 justify-between px-8 w-full">
      <div className="flex items-center gap-4">
        <Settings />
        <p className=" px-4 py-2 bg-slate-800 rounded-full text-white text-sm">
          {format(time, "hh:mm:ss a").replace("AM", "ص").replace("PM", "م")}
        </p>
      </div>
      <Image
        src="/logo.png"
        width={50}
        height={50}
        alt="logo"
        className="drop-shadow"
      />
    </div>
  );
};

export default Navbar;
