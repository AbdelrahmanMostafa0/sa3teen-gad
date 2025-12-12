"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateWaterReminder } from "@/store/features/settingsSlice";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

const DrinkWater = () => {
  const { waterReminder: { enabled, interval: waterReminderInterval } } = useSelector(
    (state: RootState) => state.Settings
  );

  const dispatch = useDispatch<AppDispatch>();

  const [showPopup, setShowPopup] = useState(false);
  const reminderSoundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    reminderSoundRef.current = new Audio("/sound/water-drip.mp3");
  }, []);
  useEffect(() => {
    const waterReminder = localStorage.getItem("isWaterReminderEnabled");
    if (waterReminder !== undefined && waterReminder !== null) {
      dispatch(updateWaterReminder(JSON.parse(waterReminder)));
    }
  }, [dispatch]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted" && enabled) {
        const interval = setInterval(() => {
          new Notification("💧 Reminder", {
            body: "بفكرك تشرب ماية عشان صحتك ياجميل",
            icon: "/water-cooler.png",
          });
        }, waterReminderInterval * 60 * 1000);
        return () => clearInterval(interval);
      }
    });
  }, [enabled, waterReminderInterval]);

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        setShowPopup(true);
        reminderSoundRef.current?.play();
        setTimeout(() => setShowPopup(false), 10000);
      }, waterReminderInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [enabled, waterReminderInterval]);

  if (!showPopup) return null;
  const waterPopup = (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-1/2 sm:left-auto sm:right-5 transform -translate-x-1/2 sm:translate-x-0 p-4 px-7 sm:w-fit w-full max-w-[95vw] pl-9 rounded-xl mx-auto bg-white z-20 flex items-center sm:justify-start justify-center shadow-lg"
    >
      <Image
        src={"/water-cooler.png"}
        width={50}
        height={50}
        alt="water-cooler"
        className="mr-3"
      />
      <p className="font-bold text-black">بفكرك تشرب ماية عشان صحتك ياجميل</p>
    </motion.div>
  );

  return createPortal(waterPopup, document.body);
};

export default DrinkWater;
